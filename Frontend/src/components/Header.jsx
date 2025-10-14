import React from "react";


export default function Header({ onHome, onReturnHome }) {
  return (
    <nav className="navbar navbar-dark bg-primary px-4 d-flex justify-content-between align-items-center">
      <span className="navbar-brand mb-0 h1">MicroAdmin Dashboard</span>
      <div className="d-flex gap-2">
        <button className="btn btn-outline-light" onClick={onHome}>
          Panel principal
        </button>
        <button className="btn btn-light" onClick={onReturnHome}>
          Volver al inicio
        </button>
      </div>
    </nav>
  );
}
