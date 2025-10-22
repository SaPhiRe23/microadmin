import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const isDocker = process.env.DOCKER === 'true';


  const PLAY_WITH_DOCKER_BACKEND = 'ip172-18-0-26-d3s66egl2o90008a0in0-5000.direct.labs.play-with-docker.com';

  return {
    plugins: [react()],
    server: {
      port: 5173,
      host: true,
      allowedHosts: [
        "ip172-18-0-41-d3s4fhq91nsg008scmm0-5173.direct.labs.play-with-docker.com",
        "localhost",
        "0.0.0.0",
      ],
    },
    define: {
      __API_BASE_URL__: JSON.stringify(
        mode === 'development'
          ? 'http://localhost:5000/api'
          : isDocker
          ? 'http://microservicio:5000/api'
          : PLAY_WITH_DOCKER_BACKEND
      ),
    },
  };
});
