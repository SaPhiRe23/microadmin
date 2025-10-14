import { useState } from "react";
import api from "../services/api";

export default function ProbarEndpoint() {
  const [url, setUrl] = useState("");
  const [metodo, setMetodo] = useState("GET");
  const [body, setBody] = useState("{}");
  const [respuesta, setRespuesta] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        url,
        metodo,
        body: metodo === "POST" ? JSON.parse(body) : {},
      };
      const res = await api.post("/test", data);
      setRespuesta(res.data);
    } catch (err) {
      setRespuesta({ error: err.message });
    }
  };

  return (
    <div>
      <h3>🧩 Probar Endpoint</h3>
      <form onSubmit={handleSubmit} className="mt-3">
        <input
          type="text"
          className="form-control mb-2"
          placeholder="URL del endpoint"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
        <select
          className="form-select mb-2"
          value={metodo}
          onChange={(e) => setMetodo(e.target.value)}
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
        </select>
        {metodo === "POST" && (
          <textarea
            className="form-control mb-3"
            rows="4"
            placeholder='Cuerpo JSON (por ejemplo: {"nombre": "Andres"})'
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        )}
        <button className="btn btn-primary">Probar</button>
      </form>

      {respuesta && (
        <div className="mt-4">
          <h5>Respuesta:</h5>
          <pre
            style={{
              backgroundColor: "#f4f4f4",
              padding: "15px",
              borderRadius: "8px",
            }}
          >
            {JSON.stringify(respuesta, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
