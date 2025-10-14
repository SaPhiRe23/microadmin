import { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import MicroserviceForm from "../components/MicroserviceForm";
import MicroserviceList from "../components/MicroserviceList";
import ProbarEndpoint from "../components/ProbarEndpoint";

export default function Dashboard({ onReturnHome }) {
  const [view, setView] = useState("list"); // 👈 controla la vista activa

  return (
    <div className="d-flex">
      <Sidebar onSelect={setView} /> {/* ← Sidebar envía 'list', 'create', 'test' */}
      <div className="flex-grow-1">
        <Header onHome={() => setView("list")} onReturnHome={onReturnHome} />
        <div className="container mt-4">
          {view === "list" && <MicroserviceList />}
          {view === "create" && <MicroserviceForm />}
          {view === "test" && <ProbarEndpoint />}
        </div>
      </div>
    </div>
  );
}
