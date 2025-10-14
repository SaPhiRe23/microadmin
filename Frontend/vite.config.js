// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Detecta si estamos corriendo dentro de Docker
  const isDocker = process.env.DOCKER === 'true';

  return {
    plugins: [react()],
    server: {
      port: 5173,
      host: true, // permite acceder desde otros contenedores
    },
    define: {
      __API_BASE_URL__: JSON.stringify(
        mode === 'development'
          ? 'http://localhost:5000/api' // fuera de Docker
          : isDocker
          ? 'http://microservicio:5000/api' // dentro de Docker
          : '/api'
      ),
    },
  };
});
