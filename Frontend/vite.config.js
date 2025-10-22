import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Detecta si estamos dentro de Docker
  const isDocker = process.env.DOCKER === 'true';

  return {
    plugins: [react()],
    server: {
      port: 5173,
      host: true, // Permite acceso desde fuera del contenedor
      allowedHosts: ["all"], // 🔥 Permite cualquier dominio (necesario para PWD)
    },
    define: {
      __API_BASE_URL__: JSON.stringify(
        mode === 'development'
          ? 'http://localhost:5000/api'        // Fuera de Docker (local)
          : isDocker
          ? 'http://microservicio:5000/api'    // Dentro del docker-compose
          : '/api'                             // Fallback genérico
      ),
    },
  };
});
