FROM node:16-alpine

WORKDIR /app

COPY . /app

RUN npm install

EXPOSE 7545

CMD ["npm", "start"]