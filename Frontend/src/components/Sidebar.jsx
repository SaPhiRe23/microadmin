import { useState } from "react";

export default function Sidebar({ onSelect }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      className={`bg-dark text-white p-3 position-fixed h-100 ${
        isOpen ? "col-2" : "col-1"
      }`}
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
              className="btn btn-light w-100"
              onClick={() => onSelect("list")}
            >
              Lista de Microservicios
            </button>
          </li>
          <li className="nav-item">
            <button
              className="btn btn-light w-100"
              onClick={() => onSelect("create")}
            >
              Crear Microservicio
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
