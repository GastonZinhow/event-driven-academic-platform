FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx nx build notification-service

EXPOSE 3001

CMD ["node", "dist/apps/notification-service/main.js"]