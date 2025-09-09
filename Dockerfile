# Use the official Node.js 22 image
FROM node:22-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package.json & package-lock.json first for caching
COPY package*.json ./

# Install dependencies (only production)
RUN npm install --omit=dev

# Copy the rest of the application
COPY . .

# Expose port (if using API Gateway local / Express, etc.)
EXPOSE 3000

# Run the app (adjust if using another entry point)
CMD ["node", "index.mjs"]
