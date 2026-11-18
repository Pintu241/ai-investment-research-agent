# Step 1: Use Node.js to build React
FROM node:22-alpine AS build

# Step 2: Set working directory
WORKDIR /app

# Step 3: Copy package files
COPY package*.json ./

# Step 4: Install dependencies
RUN npm ci

# Step 5: Copy React source code
COPY . .

# Step 6: Build the React application
RUN npm run build

# Step 7: Use Nginx to serve the build
FROM nginx:alpine

# Step 8: Copy React build files
COPY --from=build /app/dist /usr/share/nginx/html

# Step 9: Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Step 10: Expose frontend port
EXPOSE 80

# Step 11: Start Nginx
CMD ["nginx", "-g", "daemon off;"]
