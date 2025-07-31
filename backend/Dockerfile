# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of your backend application's code
COPY . .

# Your app runs on port 3000, so expose it
EXPOSE 3000

# Command to run the backend server
# Replace "npm start" with your actual start command if different
CMD [ "npm", "run", "dev" ]