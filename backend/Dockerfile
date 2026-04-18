# Gunakan image Node.js versi terbaru
FROM node:18-alpine

# Buat direktori kerja di dalam container
WORKDIR /app

# Copy package.json dan install dependency
COPY package*.json ./
RUN npm install

# Copy seluruh source code
COPY . .

# Expose port yang digunakan aplikasi (misal 3000)
EXPOSE 3000

# Perintah untuk menjalankan aplikasi
CMD ["npm", "start"]