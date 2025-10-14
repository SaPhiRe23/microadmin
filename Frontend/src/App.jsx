import React, { useState } from "react";
import api from "./services/api";

export default function CrearMicroservicio() {
  const [nombre, setNombre] = useState("");
  const [url, setUrl] = useState("");
  const [tipo, setTipo] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleCrear = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/microservicios", {
        nombre,
        url,
        tipo,
      });
      setMensaje("✅ Microservicio creado correctamente");
      setNombre("");
      setUrl("");
      setTipo("");
      console.log(response.data);
    } catch (error) {
      console.error(error);
      setMensaje("❌ Error al crear microservicio");
    }
  };

  return (
    <>
      <h2>Registrar microservicio</h2>
      <form onSubmit={handleCrear}>
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          type="text"
          placeholder="URL (http://localhost:5000)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <input
          type="text"
          placeholder="Tipo (crear, listar, etc)"
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
        />
        <button type="submit">Crear</button>
      </form>
      {mensaje && <p>{mensaje}</p>}
    </>
  );
}
