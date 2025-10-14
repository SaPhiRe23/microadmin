import axios from "axios";

const api = axios.create({
  baseURL: __API_BASE_URL__,
});

export default api;
