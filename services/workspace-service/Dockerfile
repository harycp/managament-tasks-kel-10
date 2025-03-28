# Base Image
FROM node:18-alpine

# Set Working Directory
WORKDIR /app

# Copy Files
COPY package*.json ./
COPY src ./src
COPY wait-for-db.sh .

# Install Dependencies
RUN npm install

# Expose Port
EXPOSE 5002

# Start Service
CMD ["npm", "run", "dev"]
