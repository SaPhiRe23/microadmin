import React, { useState } from "react";
import api from "../services/api";

export default function CreateFromCode() {
  const [name, setName] = useState("");
  const [code, setCode] = useState("def run(params, token):\n    return {\"echo\": params}");
  const [validMsg, setValidMsg] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const validate = async () => {
    setError(""); setValidMsg("");
    try {
      await api.post("/code/validate", { code });
      setValidMsg("✔ Código válido");
    } catch (e) {
      const msg = e?.response?.data?.error?.message || "Código inválido";
      setError(msg);
    }
  };

  const create = async () => {
    setLoading(true); setError(""); setResult(null);
    try {
      const { data } = await api.post("/microservicios/from-code", { name, code });
      setResult(data.microservicio);
      setValidMsg("");
    } catch (e) {
      const msg = e?.response?.data?.error?.message || "Error creando el microservicio";
      const det = e?.response?.data?.error?.detail;
      setError(det ? msg + ": " + det : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Crear microservicio desde código</h2>
      <div className="space-y-2">
        <label className="block text-sm">Nombre</label>
        <input value={name} onChange={e => setName(e.target.value)}
          className="border rounded p-2 w-full" placeholder="ej: hola, suma, roble_query" />
      </div>

      <div className="space-y-2">
        <label className="block text-sm">Código (debe definir run(params, token))</label>
        <textarea value={code} onChange={e => setCode(e.target.value)}
          rows={14} className="border rounded p-2 w-full font-mono" />
      </div>

      <div className="flex gap-2">
        <button onClick={validate} className="bg-blue-600 text-white px-4 py-2 rounded">Validar</button>
        <button onClick={create} disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded">
          {loading ? "Creando..." : "Crear microservicio"}
        </button>
      </div>

      {validMsg && <div className="text-green-700">{validMsg}</div>}
      {error && <div className="text-red-700 whitespace-pre-wrap">{error}</div>}

      {result && (
        <div className="border rounded p-3">
          <h3 className="font-semibold">Creado:</h3>
          <pre className="text-sm">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}