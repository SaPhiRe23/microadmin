import ast, textwrap, re, os
from typing import Tuple

FORBIDDEN_NAMES = {"__import__", "eval", "exec", "open", "compile", "input"}
FORBIDDEN_NODES = { ast.Import, ast.ImportFrom, ast.With, ast.AsyncFunctionDef, ast.Lambda, ast.Global, ast.Nonlocal, ast.ClassDef }

TEMPLATE = """\
from flask import Flask, jsonify, request

app = Flask(__name__)

# --- Código del usuario (validado) ---
{USER_CODE}

def _call_run(params, token):
    return run(params, token)

@app.get("/health")
def health():
    try:
        if 'health' in globals():
            data = globals()['health']()
            return jsonify({{"status": "ok", "service": "{SERVICE_NAME}", "data": data}}), 200
        return jsonify({{"status": "ok", "service": "{SERVICE_NAME}"}}), 200
    except Exception as e:
        return jsonify({{"status": "error", "service": "{SERVICE_NAME}", "detail": str(e)}}), 500

@app.post("/run")
def run_entry():
    try:
        payload = request.get_json(silent=True) or {{}}
        token = None
        auth = request.headers.get("Authorization", "")
        if auth.lower().startswith("bearer "):
            token = auth.split(" ", 1)[1]
        result = _call_run(payload, token)
        return jsonify({{"service": "{SERVICE_NAME}", "data": result}}), 200
    except Exception as e:
        return jsonify({{"error": {{"message": "Runtime error", "detail": str(e)}}}}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)
"""

REQS = "flask==3.0.0\n"

DOCKERFILE = """\
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY app.py .
EXPOSE 8080
CMD ["python", "app.py"]
"""

def validate_user_code(src: str) -> Tuple[bool, str]:
    if not src or not src.strip():
        return False, "El bloque de código está vacío."
    src = textwrap.dedent(src)
    try:
        tree = ast.parse(src)
    except SyntaxError as e:
        return False, f"Error de sintaxis en línea {e.lineno}: {e.msg}"

    class Guard(ast.NodeVisitor):
        def visit_Name(self, node: ast.Name):
            if node.id in FORBIDDEN_NAMES:
                raise ValueError(f"Uso no permitido de '{node.id}'")
            self.generic_visit(node)
        def visit_Attribute(self, node: ast.Attribute):
            full = getattr(ast, "unparse", lambda n: "")(node)
            if re.search(r"(os\\.system|subprocess|pathlib\\.Path\\(.+\\)\\.unlink)", full):
                raise ValueError("Llamada peligrosa detectada")
            self.generic_visit(node)
        def generic_visit(self, node):
            if type(node) in FORBIDDEN_NODES:
                raise ValueError(f"Nodo no permitido: {type(node).__name__}")
            super().generic_visit(node)

    try:
        Guard().visit(tree)
    except ValueError as e:
        return False, str(e)

    has_run = any(isinstance(n, ast.FunctionDef) and n.name == "run" for n in tree.body)
    if not has_run:
        return False, "Debe definir una función 'run(params, token)'."
    return True, ""


def materialize_service(service_name: str, user_code: str, base_dir: str) -> str:
    service_dir = os.path.join(base_dir, service_name)
    os.makedirs(service_dir, exist_ok=True)
    app_py = TEMPLATE.format(USER_CODE=textwrap.dedent(user_code), SERVICE_NAME=service_name)
    with open(os.path.join(service_dir, "app.py"), "w", encoding="utf-8") as f:
        f.write(app_py)
    with open(os.path.join(service_dir, "requirements.txt"), "w", encoding="utf-8") as f:
        f.write(REQS)
    with open(os.path.join(service_dir, "Dockerfile"), "w", encoding="utf-8") as f:
        f.write(DOCKERFILE)
    return service_dir
