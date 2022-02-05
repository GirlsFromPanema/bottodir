FROM node:latest

WORKDIR /app

COPY package.json package.json
COPY .env .env
COPY . .

RUN npm install

CMD ["node", "npm start"]