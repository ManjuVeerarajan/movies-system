# Build stage
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
# Debug: Check build output
RUN ls -la /app/build || echo "Build directory is empty"

# Serve stage
FROM nginx:alpine
# Copy built files
COPY --from=builder /app/build /usr/share/nginx/html
# Add custom Nginx config for SPA routing
RUN echo 'server { \
  listen 80; \
  location / { \
    root /usr/share/nginx/html; \
    try_files $uri $uri/ /index.html; \
  } \
}' > /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]