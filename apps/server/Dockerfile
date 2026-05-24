FROM node:18-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install -g pnpm && pnpm install

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Command to run (using nodemon for dev, or headers for prod)
CMD ["pnpm", "dev"]