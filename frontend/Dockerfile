# frontend/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 5173

# Vite требует --host для доступа извне контейнера
CMD ["npm", "run", "dev", "--", "--host"]