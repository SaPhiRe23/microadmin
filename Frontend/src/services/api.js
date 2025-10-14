import axios from "axios";

const api = axios.create({
  //frontend dentro de Docker Compose:
  baseURL: "http://microservicio_crear:5000/api",
  
  //frontend fuera de Docker:
  // baseURL: "http://localhost:5000/api",
});

export default api;
