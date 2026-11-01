FROM node:18-alpine

WORKDIR /app

# Copy server package definitions
COPY server/package*.json ./
RUN npm install --omit=dev

# Copy server code
COPY server/ ./

EXPOSE 5000

CMD ["npm", "start"]
