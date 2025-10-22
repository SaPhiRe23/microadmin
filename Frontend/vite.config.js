import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const isDocker = process.env.DOCKER === 'true';

  return {
    plugins: [react()],
    server: {
      port: 5173,
      host: true,
      allowedHosts: [
        "ip172-18-0-78-d3s7uqi91nsg008scsrg-5173.direct.labs.play-with-docker.com",
        "localhost",
        "0.0.0.0",
      ],
    },
    define: {
      __API_BASE_URL__: JSON.stringify(
      "http://ip172-18-0-78-d3s7uqi91nsg008cscrg-5000.direct.labs.play-with-docker.com/api"
    ),
    },
  };
});
