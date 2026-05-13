# Build stage
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Build the Vite application
RUN npm run build

# Serve stage using a lightweight web server (Nginx)
FROM nginx:alpine

# Copy the built assets from the previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Configure Nginx for Single Page Applications (SPA) routing
# This is handled by default if we use a basic conf, but for react-router we often need a custom nginx.conf. 
# For now, replacing default conf to route all requests to index.html
RUN echo "server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files \$uri \$uri/ /index.html; \
    } \
}" > /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
