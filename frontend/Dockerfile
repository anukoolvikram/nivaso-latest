# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of your frontend application's code
COPY . .

# Vite's default port is 5173, so expose it
EXPOSE 5173

# Command to run the Vite dev server
# The "-- --host" flag is important to expose the server outside the container
CMD [ "npm", "run", "dev", "--", "--host" ]