# backend/Dockerfile
FROM node:18-alpine

WORKDIR /app

# 1. Копируем файлы зависимостей (для кэширования слоя)
COPY package*.json ./
COPY prisma ./prisma/

# 2. Устанавливаем зависимости
RUN --mount=type=cache,target=/root/.npm npm ci

# 3. Копируем исходный код
COPY . .

# 4. Генерируем Prisma Client (обязательно для работы)
RUN npx prisma generate

# 5. Открываем порт
EXPOSE 3000

# 6. Запускаем в режиме разработки (hot-reload)
CMD ["npm", "run", "start:dev"]