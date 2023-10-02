# Use the official Node.js image as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy the rest of the application code to the container
COPY . .

# Install application dependencies
RUN yarn install --production

# Expose the port your Express.js app is listening on
EXPOSE 3001

# Command to run the application
CMD ["node", "userService.js"]
