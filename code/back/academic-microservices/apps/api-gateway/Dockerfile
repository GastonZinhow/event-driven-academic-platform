FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx nx build api-gateway

EXPOSE 3000

CMD ["node", "dist/apps/api-gateway/main.js"]