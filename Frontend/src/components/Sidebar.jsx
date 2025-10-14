import { useState } from "react";

export default function Sidebar({ onSelect }) {
  const [isOpen, setIsOpen] = useState(true);
  const [active, setActive] = useState("list"); // 👈 guarda la vista activa

  const handleSelect = (view) => {
    setActive(view);   // actualiza botón activo
    onSelect(view);    // comunica al Dashboard
  };

  return (
    <div
      className={`bg-dark text-white p-3 ${isOpen ? "col-2" : "col-1"} vh-100`}
      style={{ transition: "0.3s" }}
    >
      <button
        className="btn btn-outline-light w-100 mb-3"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "<<" : ">>"}
      </button>

      {isOpen && (
        <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <button
              className={`btn w-100 ${
                active === "list" ? "btn-primary text-white" : "btn-light"
              }`}
              onClick={() => handleSelect("list")}
            >
              📋 Lista de Microservicios
            </button>
          </li>
          <li className="nav-item mb-2">
            <button
              className={`btn w-100 ${
                active === "create" ? "btn-primary text-white" : "btn-light"
              }`}
              onClick={() => handleSelect("create")}
            >
              ➕ Crear Microservicio
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`btn w-100 ${
                active === "test" ? "btn-primary text-white" : "btn-light"
              }`}
              onClick={() => handleSelect("test")}
            >
              🧩 Probar Endpoint
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
