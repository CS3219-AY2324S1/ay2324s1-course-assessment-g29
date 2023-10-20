FROM node:20-alpine
WORKDIR /app
COPY . .
RUN yarn install --production
EXPOSE 3002
CMD ["node", "index.js"]