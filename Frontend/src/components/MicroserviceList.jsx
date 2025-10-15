// Frontend/src/components/MicroserviceList.jsx
import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function MicroserviceList({ reloadToken }) {
  // ---- estado tabla ----
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // ---- estado logs ----
  const [logsOpen, setLogsOpen] = useState(null);  // ID del micro con panel abierto
  const [logsText, setLogsText] = useState("");
  const [loadingLogs, setLoadingLogs] = useState(false);

  // cargar lista
  const load = async () => {
    setLoading(true); setErr("");
    try {
      const { data } = await api.get("/microservicios");
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(e?.response?.data?.error?.message || "No se pudieron cargar los microservicios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);
  useEffect(() => { if (reloadToken) load(); }, [reloadToken]);

  // abrir logs
  const fetchLogs = async (id) => {
    setLoadingLogs(true); setLogsText("");
    try {
      const { data } = await api.get(`/microservicios/${id}/logs`, { params: { tail: 300 } });
      setLogsText(data.logs || "");
      setLogsOpen(id);
    } catch (e) {
      setLogsText(e?.response?.data?.error?.message || "No se pudieron obtener los logs");
      setLogsOpen(id);
    } finally {
      setLoadingLogs(false);
    }
  };

  // eliminar micro + contenedor
  const deleteMicro = async (id) => {
    if (!confirm("¿Eliminar microservicio? También se intentará borrar el contenedor.")) return;
    try {
      await api.delete(`/microservicios/${id}`);
      setItems(prev => prev.filter(m => m.id !== id));
      if (logsOpen === id) setLogsOpen(null);
    } catch (e) {
      alert(e?.response?.data?.error?.message || "No se pudo eliminar");
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Microservicios registrados</h2>

      {err && <div className="text-red-600">{err}</div>}
      {loading ? (
        <div>Cargando...</div>
      ) : (
        <table className="w-full text-sm border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">Nombre</th>
              <th className="p-2 text-left">Tipo</th>
              <th className="p-2 text-left">URL</th>
              <th className="p-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} className="border-t">
                <td className="p-2">{item.id}</td>
                <td className="p-2">{item.nombre}</td>
                <td className="p-2">{item.tipo}</td>
                <td className="p-2">{item.url}</td>
                <td className="p-2">
                  <button
                    className="px-2 py-1 text-xs bg-gray-700 text-white rounded mr-2"
                    onClick={() => fetchLogs(item.id)}
                  >
                    Ver logs
                  </button>
                  <button
                    className="px-2 py-1 text-xs bg-red-600 text-white rounded"
                    onClick={() => deleteMicro(item.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td className="p-2 text-gray-500" colSpan={5}>No hay microservicios aún.</td></tr>
            )}
          </tbody>
        </table>
      )}

      {/* Panel de logs */}
      {logsOpen && (
        <div className="mt-4 border rounded bg-black text-green-400 p-3 max-h-80 overflow-auto">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">Logs del microservicio #{logsOpen}</h3>
            <button
              className="text-sm bg-gray-600 text-white px-2 py-1 rounded"
              onClick={() => setLogsOpen(null)}
            >
              Cerrar
            </button>
          </div>
          {loadingLogs ? (
            <div>Cargando...</div>
          ) : (
            <pre className="whitespace-pre-wrap text-xs">{logsText}</pre>
          )}
        </div>
      )}
    </div>
  );
}
