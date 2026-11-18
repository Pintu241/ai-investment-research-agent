
# Step 1: Use Node.js as the base image
FROM node:22-alpine

# Step 2: Create a working directory
WORKDIR /app

# Step 3: Copy package files
COPY package*.json ./

# Step 4: Install dependencies
RUN npm ci --omit=dev

# Step 5: Copy the backend source code
COPY . .

# Step 6: Backend runs on port 5000
EXPOSE 5000

# Step 7: Start the backend
CMD ["npm", "start"]
