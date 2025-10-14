import React from "react";

export default function Home({ onEnter }) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-light">
      <h1 className="display-4 text-primary mb-3">MicroAdmin</h1>
      <p className="lead text-center w-75 mb-4">
        Bienvenido al panel de administración de microservicios conectados con
        Roble. Aquí podrás crear, editar y gestionar tus microservicios
        fácilmente.
      </p>
      <button className="btn btn-primary btn-lg" onClick={onEnter}>
        Ir al Dashboard
      </button>
    </div>
  );
}
