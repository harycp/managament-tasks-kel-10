# Gunakan base image Node.js versi 20 yang ringan
FROM node:20-alpine

# Tentukan direktori kerja di dalam container
WORKDIR /usr/src/app

# Salin package.json dan package-lock.json terlebih dahulu
# Ini memanfaatkan layer caching Docker
COPY package*.json ./

# Install dependencies aplikasi
RUN npm install

# Salin semua sisa source code aplikasi
COPY . .

# Expose port yang digunakan oleh service ini (akan di-map di docker-compose)
# Ganti port ini sesuai service masing-masing jika diperlukan,
# tapi karena kita definisikan di compose, ini lebih bersifat dokumentatif.
# EXPOSE 5000 

# Perintah untuk menjalankan aplikasi saat container start
# Kita gunakan "node" langsung, bukan "nodemon", untuk lingkungan produksi
CMD [ "node", "src/server.js" ]