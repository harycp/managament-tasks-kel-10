# Gunakan base image Node.js versi 20 yang ringan
FROM node:20-alpine

# Tentukan direktori kerja di dalam container
WORKDIR /usr/src/app

# Ini memanfaatkan layer caching Docker
COPY package*.json ./

# Install dependencies aplikasi
RUN npm install

# Salin semua sisa source code aplikasi
COPY . .

CMD [ "node", "src/server.js" ]