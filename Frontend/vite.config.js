import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const isDocker = process.env.DOCKER === 'true';

  // ⚠️ Cambia esta URL por la que te da PlayWithDocker para el backend (puerto 5000)
  const PLAY_WITH_DOCKER_BACKEND = 'http://ip172-18-0-78-d3s7uqi91nsg008scsrg-5000.direct.labs.play-with-docker.com';

  return {
    plugins: [react()],
    server: {
      port: 5173,
      host: true,
      allowedHosts: [
        "http://ip172-18-0-78-d3s7uqi91nsg008scsrg-5173.direct.labs.play-with-docker.com/",
        "localhost",
        "0.0.0.0",
      ],
    },
    define: {
      __API_BASE_URL__: JSON.stringify(
        mode === 'development'
          ? 'http://localhost:5000/api'           //local
          : isDocker
          ? 'http://microservicio:5000/api'       //dentro del compose
          : PLAY_WITH_DOCKER_BACKEND              //acceso desde PlayWithDocker
      ),
    },
  };
});
