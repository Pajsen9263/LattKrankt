# Use Node.js LTS version as the base image (Debian variant)
FROM node:20

# Set the working directory inside the container
WORKDIR /

# Copy package.json and package-lock.json (or yarn.lock) first to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install --force


# Expose the Next.js app port
EXPOSE 3000

# Build and start the app
CMD ["sh", "-c", "npm run build && npm start"]


