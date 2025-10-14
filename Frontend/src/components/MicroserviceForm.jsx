import { useState, useEffect } from "react";
import api from "../services/api";

export default function MicroserviceForm({ editing }) {
  const [form, setForm] = useState({ nombre: "", tipo: "", url: "" });
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    if (editing) setForm(editing);
  }, [editing]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/microservicios", form);
      setMensaje("✅ Microservicio creado correctamente");
      setForm({ nombre: "", tipo: "", url: "" });
    } catch {
      setMensaje("❌ Error al crear microservicio");
    }
  };

  return (
    <div className="container mt-4">
      <h3>{editing ? "Editar Microservicio" : "Crear Microservicio"}</h3>
      <form onSubmit={handleSubmit} className="mt-3">
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
          placeholder="URL del microservicio"
          value={form.url}
          onChange={handleChange}
          required
        />
        <button type="submit" className="btn btn-success">
          {editing ? "Guardar Cambios" : "Crear"}
        </button>
      </form>
      {mensaje && <p className="mt-3">{mensaje}</p>}
    </div>
  );
}
