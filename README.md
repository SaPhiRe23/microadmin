# Microadmin (Flask)

Pequeña web en **Python (Flask)** para **crear/editar/eliminar/listar** registros de "microservicios".

## Requisitos
- Python 3.10+ (Windows 10 ok)
- VS Code (opcional)
- (Opcional) Virtualenv

## Instalación
```bash
cd microadmin
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

## Ejecutar
```bash
python app.py
```
Abre http://127.0.0.1:5000 en el navegador.

## Campos
- Name
- Code (único)
- Processing Type (Filtro, Agregacion, Analisis, Otro)
- BasePath
- SampleParamsJson
- RobleToken
- Enabled (checkbox)
