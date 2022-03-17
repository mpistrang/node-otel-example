FROM node:lts-alpine

WORKDIR /app
RUN mkdir -p /app/src

COPY ./package*.json /app
RUN npm ci

CMD ["node", "/app/src/consume.js"]
