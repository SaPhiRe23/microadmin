import React, { useEffect, useState } from "react";
import api from "./services/api";

export default function ListarMicroservicios() {
  const [lista, setLista] = useState([]);

  const obtenerMicroservicios = async () => {
    const res = await api.get("/microservicios");
    setLista(res.data);
  };

  useEffect(() => {
    obtenerMicroservicios();
  }, []);

  const eliminar = async (id) => {
    await api.delete(`/microservicios/${id}`);
    obtenerMicroservicios();
  };

  return (
    <>
      <h2>Microservicios registrados</h2>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>URL</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {lista.map((m) => (
            <tr key={m.id}>
              <td>{m.id}</td>
              <td>{m.nombre}</td>
              <td>{m.tipo}</td>
              <td>{m.url}</td>
              <td>
                <button onClick={() => eliminar(m.id)}>🗑️ Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
