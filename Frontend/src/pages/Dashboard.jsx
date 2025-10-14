import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import MicroserviceList from "../components/MicroserviceList";
import MicroserviceForm from "../components/MicroserviceForm";
import Header from "../components/Header";
import api from "../services/api";

export default function Dashboard({ onReturnHome }) {
  const [view, setView] = useState("list");
  const [services, setServices] = useState([]);
  const [editing, setEditing] = useState(null);

  const fetchServices = async () => {
    try {
      const res = await api.get("/microservicios");
      setServices(res.data);
    } catch (err) {
      console.error("Error al obtener microservicios:", err);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleSubmit = async (data) => {
    try {
      if (data.id) {
        await api.put(`/microservicios/${data.id}`, data);
      } else {
        await api.post("/microservicios", data);
      }
      setEditing(null);
      setView("list");
      fetchServices();
    } catch (err) {
      console.error("Error al guardar microservicio:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/microservicios/${id}`);
      fetchServices();
    } catch (err) {
      console.error("Error al eliminar microservicio:", err);
    }
  };

  const handleHome = () => {
    setEditing(null);
    setView("list");
  };

  return (
    <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
      <Header onHome={handleHome} onReturnHome={onReturnHome} />
      <div className="d-flex flex-grow-1">
        <Sidebar onSelect={setView} />
        <div className="flex-grow-1" style={{ marginLeft: "200px", padding: "20px" }}>
          {view === "list" && (
            <MicroserviceList
              services={services}
              onEdit={(s) => {
                setEditing(s);
                setView("create");
              }}
              onDelete={handleDelete}
            />
          )}
          {view === "create" && (
            <MicroserviceForm onSubmit={handleSubmit} editing={editing} />
          )}
        </div>
      </div>
    </div>
  );
}
