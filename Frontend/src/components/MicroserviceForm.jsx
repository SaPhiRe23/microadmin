import { useState, useEffect } from "react";
import api from "../services/api";

export default function MicroserviceForm({ editing }) {
  const [code, setCode] = useState("");
  const [form, setForm] = useState({ nombre: "", tipo: "", url: "" });
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    if (editing) setForm(editing);
  }, [editing]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");

    const { nombre, tipo, url } = form;

    // Validación: debe venir código o una URL existente
    if (!code.trim() && !url.trim()) {
      setMensaje("❌ Ingresa código o una URL existente.");
      return;
    }

    try {
      if (code.trim()) {
        // Crear, construir y levantar en Docker
        await api.post("/microservicios/from-code", {
          name: nombre,
          code,
        });
      } else {
        // Solo registrar un microservicio ya corriendo
        await api.post("/microservicios", { nombre, tipo, url });
      }

      setMensaje("✅ Microservicio creado correctamente");
      setForm({ nombre: "", tipo: "", url: "" });
      setCode("");
    } catch (e) {
      const m = e?.response?.data?.error?.message || "Error al crear microservicio";
      const d = e?.response?.data?.error?.detail;
      setMensaje(`❌ ${d ? `${m}: ${d}` : m}`);
    }
  };

  const urlIsRequired = code.trim() === "";

  return (
    <div className="container mt-4">
      <h3>{editing ? "Editar Microservicio" : "Crear Microservicio"}</h3>

      {/* noValidate evita que el navegador bloquee el submit cuando la URL no es requerida */}
      <form noValidate onSubmit={handleSubmit} className="mt-3">
        <input
          type="text"
          name="nombre"
          className="form-control mb-2"
          placeholder="Nombre del microservicio"
          value={form.nombre}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="tipo"
          className="form-control mb-2"
          placeholder="Tipo (filtrado, análisis, etc.)"
          value={form.tipo}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="url"
          className="form-control mb-3"
          placeholder="URL del microservicio (si ya está corriendo)"
          value={form.url}
          onChange={handleChange}
          required={urlIsRequired}   // ← Solo obligatoria si NO hay código
        />

        {/* Código del microservicio con el mismo estilo Bootstrap */}
        <label className="form-label mt-3">Código del microservicio (opcional)</label>
        <textarea
          className="form-control mb-3 font-monospace"
          rows={10}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder={"def run(params, token):\n    return {'echo': params}"}
        />
        <p className="text-muted small">
          Si escribes código aquí, al crear se construirá y se levantará en Docker automáticamente.
        </p>

        <button type="submit" className="btn btn-success">
          {editing ? "Guardar Cambios" : "Crear"}
        </button>
      </form>

      {mensaje && <p className="mt-3">{mensaje}</p>}
    </div>
  );
}
