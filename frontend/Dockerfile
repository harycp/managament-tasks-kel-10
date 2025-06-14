FROM node:20-alpine AS build-stage

WORKDIR /app

# Salin package.json dan install dependency
COPY package*.json ./
RUN npm install

# Salin semua sisa kode frontend
COPY . .

# Jalankan perintah build dari package.json
RUN npm run build

FROM nginx:stable-alpine

COPY --from=build-stage /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80, port default Nginx
EXPOSE 80

# Perintah untuk menjalankan Nginx
CMD ["nginx", "-g", "daemon off;"]