from flask import Flask, request, jsonify, render_template
import requests
import os

app = Flask(__name__)

# URL base de Roble
ROBLE_API_URL = "https://roble.openlab.uninorte.edu.co/api"

# =========================
# MICRO SERVICIO /CREAR
# =========================
@app.route('/crear', methods=['GET', 'POST'])
def crear_registro():
    if request.method == 'GET':
        # Si entras desde el navegador, muestra ayuda
        return jsonify({
            "info": "Usa POST para crear un registro",
            "ejemplo": {
                "metodo": "POST",
                "url": "/crear",
                "body": {"nombre": "Juan", "curso": "Docker"},
                "header": "Authorization: Bearer <token>"
            }
        }), 200

    # Obtener token del encabezado
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({"error": "Token faltante o inválido"}), 401

    token = auth_header.split(" ")[1]

    # Obtener datos del cuerpo
    data = request.get_json()
    if not data:
        return jsonify({"error": "No se recibieron datos"}), 400

    try:
        # En producción usarías algo como:
        # response = requests.post(f"{ROBLE_API_URL}/records",
        #                          headers={"Authorization": f"Bearer {token}"},
        #                          json=data)
        # resultado = response.json()

        # Simulación local
        resultado = {
            "mensaje": "Registro creado correctamente en Roble",
            "datos": data
        }

        return jsonify(resultado), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# =========================
# DASHBOARD WEB
# =========================
microservicios = []

@app.route('/dashboard')
def dashboard():
    return render_template('index.html', microservicios=microservicios)

@app.route('/api/microservicios', methods=['GET'])
def listar_microservicios():
    return jsonify(microservicios)

@app.route('/api/microservicios', methods=['POST'])
def crear_microservicio():
    data = request.get_json()
    microservicio = {
        "id": len(microservicios) + 1,
        "nombre": data.get("nombre"),
        "url": data.get("url"),
        "tipo": data.get("tipo")
    }
    microservicios.append(microservicio)
    return jsonify({"mensaje": "Microservicio creado", "microservicio": microservicio}), 201

@app.route('/api/microservicios/<int:id>', methods=['PUT'])
def editar_microservicio(id):
    data = request.get_json()
    for m in microservicios:
        if m["id"] == id:
            m.update(data)
            return jsonify({"mensaje": "Microservicio actualizado", "microservicio": m}), 200
    return jsonify({"error": "No encontrado"}), 404

@app.route('/api/microservicios/<int:id>', methods=['DELETE'])
def eliminar_microservicio(id):
    global microservicios
    microservicios = [m for m in microservicios if m["id"] != id]
    return jsonify({"mensaje": f"Microservicio {id} eliminado"}), 200

@app.route('/api/test', methods=['POST'])
def probar_endpoint():
    data = request.get_json()
    try:
        metodo = data.get("metodo", "GET").upper()
        url = data.get("url")
        body = data.get("body", {})

        if metodo == "GET":
            response = requests.get(url)
        else:
            response = requests.post(url, json=body)

        # Intentar leer como JSON
        try:
            contenido = response.json()
        except ValueError:
            # Si no es JSON, devolver texto plano
            contenido = response.text

        return jsonify({
            "codigo": response.status_code,
            "respuesta": contenido
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500




# =========================
# PÁGINA PRINCIPAL
# =========================
@app.route('/', methods=['GET'])
def index():
    return jsonify({
        "status": "Microservicio 'crear' operativo con Dashboard",
        "endpoints": {
            "/crear": "POST → crea registros",
            "/dashboard": "Interfaz web de administración"
        }
    })


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.getenv("PORT", 5000)))
