
# MicroAdmin – Plataforma de Gestión de Microservicios

## Descripción del Proyecto

MicroAdmin es una aplicación web diseñada para administrar microservicios de manera sencilla.
Permite registrar, listar, editar, eliminar y probar endpoints REST conectados a la API de Roble (simulada localmente).

El proyecto está desarrollado con:

- Frontend: React + Vite
- Backend: Flask (Python)
- Contenedores: Docker y Docker Compose

---

## Arquitectura del Proyecto

El sistema está compuesto por dos servicios principales:

1. **Frontend (React + Vite)**
   - Proporciona la interfaz de usuario.
   - Consume los endpoints del backend vía HTTP.
   - Se ejecuta en el puerto 5173.

2. **Backend (Flask)**
   - Expone una API REST con operaciones CRUD sobre microservicios.
   - Simula el registro de datos en la API de Roble.
   - Se ejecuta en el puerto 5000.

Ambos servicios se orquestan mediante Docker Compose, comunicándose por una red interna de Docker.

---

## Diagrama de Arquitectura

<img width="1024" height="1536" src="https://github.com/user-attachments/assets/90a9d894-69de-4f4c-89ff-43594086e529" />


Descripción del flujo:
1. El usuario accede desde el navegador al frontend (React).
2. El frontend envía peticiones HTTP al backend Flask.
3. El backend procesa las solicitudes y devuelve respuestas JSON.
4. (Opcional) Se simula comunicación con la API externa de Roble.

---

## Instrucciones de Uso

### Requisitos previos
- Tener Docker y Docker Compose instalados.
- Puerto 5173 (frontend) y 5000 (backend) libres en tu sistema.

### Construcción y ejecución

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/tuusuario/microadmin.git
   cd microadmin
   ```

2. Levantar los contenedores:
   ```bash
   docker compose up --build
   ```

3. Acceder a la aplicación:
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend: [http://localhost:5000](http://localhost:5000)

4. Para detener los servicios:
   ```bash
   docker compose down
   ```

---

## Endpoints principales

| Método | Endpoint | Descripción |
|:-------|:----------|:------------|
| GET | /api/microservicios | Lista todos los microservicios registrados |
| POST | /api/microservicios | Crea un nuevo microservicio |
| PUT | /api/microservicios/<id> | Edita un microservicio existente |
| DELETE | /api/microservicios/<id> | Elimina un microservicio |
| POST | /api/test | Permite probar un endpoint remoto (GET o POST) |

---

## Ejemplos de Solicitudes y Respuestas

### Crear un microservicio
**Solicitud:**
```bash
POST /api/microservicios
Content-Type: application/json

{
  "nombre": "Usuarios",
  "tipo": "Gestión",
  "url": "http://localhost:5000/crear"
}
```

**Respuesta:**
```json
{
  "mensaje": "Microservicio creado",
  "microservicio": {
    "id": 1,
    "nombre": "Usuarios",
    "tipo": "Gestión",
    "url": "http://localhost:5000/crear"
  }
}
```

---

### Listar microservicios
**Solicitud:**
```bash
GET /api/microservicios
```

**Respuesta:**
```json
[
  {
    "id": 1,
    "nombre": "Usuarios",
    "tipo": "Gestión",
    "url": "http://localhost:5000/crear"
  }
]
```

---

### Probar Endpoint
**Solicitud:**
```bash
POST /api/test
Content-Type: application/json

{
  "url": "http://localhost:5000/crear",
  "metodo": "POST",
  "body": {"nombre": "Andres", "curso": "Docker"}
}
```

**Respuesta:**
```json
{
  "codigo": 201,
  "respuesta": {
    "mensaje": "Registro creado correctamente en Roble",
    "datos": {"nombre": "Andres", "curso": "Docker"}
  }
}

