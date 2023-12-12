# Gunakan image node.js versi terbaru sebagai base image
FROM node:18

# Buat direktori kerja di dalam container
WORKDIR /usr/app

# Salin package.json dan package-lock.json ke direktori kerja
COPY package*.json ./

# Install dependensi
RUN npm install

# Salin seluruh kode proyek ke direktori kerja
COPY . .

# Port yang akan di-expose
EXPOSE 8080

# Perintah untuk menjalankan aplikasi ketika container dijalankan
CMD ["npm", "start"]
