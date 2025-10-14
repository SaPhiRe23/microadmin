from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
import json
import tempfile, shutil

from errors import register_error_handlers, APIError
from codegen import validate_user_code, materialize_service
from docker_runtime import build_and_run

app = Flask(__name__)
CORS(app)
register_error_handlers(app)

# --- In-memory store (simple para la entrega) ---
MICROS = []
NEXT_ID = 1

def _require_json():
    if not request.is_json:
        raise APIError("Content-Type must be application/json", status_code=415)

# --- Health ---
@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "service": "admin-backend"}), 200

# --- CRUD: /api/microservicios ---
@app.route("/api/microservicios", methods=["GET"])
def list_microservices():
    return jsonify(MICROS), 200

@app.route("/api/microservicios", methods=["POST"])
def create_microservice():
    global NEXT_ID
    _require_json()
    body = request.get_json()
    nombre = (body.get("nombre") or "").strip()
    tipo = (body.get("tipo") or "").strip()
    url = (body.get("url") or "").strip()

    if not nombre or not url:
        raise APIError("nombre y url son obligatorios", status_code=400)

    micro = {
        "id": NEXT_ID,
        "nombre": nombre,
        "tipo": tipo or "Otro",
        "url": url.rstrip("/"),
        "health_path": "/health",
        "run_path": "/run"
    }
    MICROS.append(micro)
    NEXT_ID += 1
    return jsonify(micro), 201

@app.route("/api/microservicios/<int:mid>", methods=["DELETE"])
def delete_microservice(mid):
    idx = next((i for i, m in enumerate(MICROS) if m["id"] == mid), None)
    if idx is None:
        raise APIError("Microservicio no encontrado", status_code=404)
    MICROS.pop(idx)
    return jsonify({"deleted": mid}), 200

# --- Probar endpoint de un microservicio (proxy) ---
@app.route("/api/test", methods=["POST"])
def test_proxy():
    _require_json()
    payload = request.get_json() or {}
    url = (payload.get("url") or "").strip()
    metodo = (payload.get("metodo") or "GET").upper()
    body = payload.get("body", {})

    if not url:
        raise APIError("Falta 'url' para probar", status_code=400)

    headers = {}
    auth = request.headers.get("Authorization")
    if auth:
        headers["Authorization"] = auth

    try:
        if metodo == "GET":
            r = requests.get(url, headers=headers, timeout=20)
        elif metodo == "POST":
            r = requests.post(url, json=body, headers=headers, timeout=30)
        elif metodo == "PUT":
            r = requests.put(url, json=body, headers=headers, timeout=30)
        elif metodo == "DELETE":
            r = requests.delete(url, headers=headers, timeout=20)
        else:
            raise APIError(f"Método no soportado: {metodo}", status_code=400)
    except requests.exceptions.RequestException as e:
        raise APIError("Fallo al conectar con el microservicio", status_code=502, detail=str(e))

    try:
        resp_body = r.json()
    except ValueError:
        resp_body = {"raw": r.text[:2000]}

    return jsonify({
        "target_url": url,
        "status_code": r.status_code,
        "headers": dict(r.headers),
        "body": resp_body
    }), 200

# --- Codegen: validar código ---
@app.post("/api/code/validate")
def validate_code():
    body = request.get_json() or {}
    code = body.get("code", "")
    ok, msg = validate_user_code(code)
    if not ok:
        return jsonify({"valid": False, "error": {"message": msg}}), 400
    return jsonify({"valid": True}), 200

# --- Codegen: crear microservicio desde código ---
@app.post("/api/microservicios/from-code")
def create_ms_from_code():
    global NEXT_ID
    body = request.get_json() or {}
    name = (body.get("name") or "").strip().lower().replace(" ", "_")
    code = body.get("code", "")

    if not name:
        raise APIError("Falta 'name'", status_code=400)

    ok, msg = validate_user_code(code)
    if not ok:
        return jsonify({"error": {"message": "Código inválido", "detail": msg}}), 400

    tmp = tempfile.mkdtemp(prefix="svcgen_")
    try:
        service_dir = materialize_service(name, code, tmp)
        build_info = build_and_run(name, service_dir)
        url = f"http://ms_{name}:8080"
        micro = {
            "id": NEXT_ID,
            "nombre": name,
            "tipo": "Usuario",
            "url": url,
            "health_path": "/health",
            "run_path": "/run",
            "container": build_info.get("container"),
            "image": build_info.get("image")
        }
        MICROS.append(micro)
        NEXT_ID += 1
        return jsonify({"microservicio": micro, "build": build_info}), 201
    except Exception as e:
        return jsonify({"error": {"message": "No se pudo crear el microservicio", "detail": str(e)}}), 500
    finally:
        shutil.rmtree(tmp, ignore_errors=True)

# --- Raíz ---
@app.route("/", methods=["GET"])
def index():
    return jsonify({
        "status": "admin-backend operativo",
        "endpoints": {
            "GET /health": "estado",
            "GET /api/microservicios": "listar",
            "POST /api/microservicios": "crear {nombre,tipo,url}",
            "DELETE /api/microservicios/<id>": "eliminar",
            "POST /api/test": "probar un endpoint arbitrario",
            "POST /api/code/validate": "valida código de usuario",
            "POST /api/microservicios/from-code": "genera, construye y levanta un microservicio desde código"
        }
    }), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", 5000)))
