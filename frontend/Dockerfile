# Development Dockerfile for Next.js Frontend
FROM node:20.19.6-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies with legacy peer deps (for React 19 compatibility)
RUN npm install --legacy-peer-deps

# Copy application code
COPY . .

# Expose port 3001
EXPOSE 3001

# Set environment
ENV NODE_ENV=development

# Start development server
CMD ["npm", "run", "dev"]
