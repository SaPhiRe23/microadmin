import { useState, useEffect } from "react";
import './App.css';


export default function MicroserviceForm({ onSubmit, editing }) {
  const [form, setForm] = useState({
    nombre: "",
    tipo: "",
    url: "",
  });

  useEffect(() => {
    if (editing) setForm(editing);
  }, [editing]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    setForm({ nombre: "", tipo: "", url: "" });
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
    </div>
  );
}
