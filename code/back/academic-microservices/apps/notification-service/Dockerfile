FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx nx build audit-service

EXPOSE 3002

CMD ["node", "dist/apps/audit-service/main.js"]