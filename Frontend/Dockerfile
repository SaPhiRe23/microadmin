# Dockerfile del frontend
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV DOCKER=true
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "dev"]
