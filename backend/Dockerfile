FROM node:18
WORKDIR /app

COPY . .
COPY .env.docker .env
RUN npm install
CMD ["node", "src/index.js"]
