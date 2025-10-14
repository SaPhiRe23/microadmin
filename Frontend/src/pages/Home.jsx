import React from "react";

export default function Home({ onEnterDashboard }) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100 text-center bg-light">
      <h1 className="mb-3">🧠 MicroAdmin</h1>
      <p className="mb-4 text-secondary" style={{ maxWidth: "500px" }}>
        Bienvenido al panel de administración de microservicios conectados con
        Roble. Aquí podrás crear, editar y gestionar tus microservicios
        fácilmente.
      </p>
      <button className="btn btn-primary btn-lg" onClick={onEnterDashboard}>
        Ir al Dashboard
      </button>
    </div>
  );
}
