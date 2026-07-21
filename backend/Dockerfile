FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY src ./src
COPY .env.example ./.env.example
EXPOSE 4000
ENV NODE_ENV=production
CMD ["node", "src/server.js"]
