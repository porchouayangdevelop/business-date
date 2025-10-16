# Use an official Node.js runtime as the base image
FROM node:20-alpine

RUN npm i -g pnpm@latest

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json pnpm-lock.yaml ./

# Install application dependencies
RUN pnpm install

# Copy the rest of the application source code
COPY . ./

# Expose the port the app runs on
EXPOSE 5333

# The default command to run when the container starts
CMD [ "pnpm", "start" ]