FROM node:16

RUN npm install -g nodemon

WORKDIR /app

COPY ./package*.json/ ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]