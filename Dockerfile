# Build stage
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:stable-alpine
WORKDIR /app

# Cài đặt Node.js và npm trong image Nginx
RUN apk add --update nodejs npm

# Sao chép files frontend từ builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Sao chép server code và cài đặt dependencies
COPY server /app/server
COPY nginx-express.conf /etc/nginx/nginx.conf

# Cài đặt dependencies cho server Express
WORKDIR /app/server
RUN npm install

# Tạo startup script
COPY docker-entrypoint.sh /
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80

# Sử dụng script để khởi động cả Nginx và Express
ENTRYPOINT ["/docker-entrypoint.sh"] 