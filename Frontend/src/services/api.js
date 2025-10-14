import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // Flask corre en el puerto 5000
});

export default api;
