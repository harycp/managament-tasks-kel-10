FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY src ./src

RUN npm install

EXPOSE 5173

CMD ["npm", "run", "dev"]
