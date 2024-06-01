FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm cache clean --force
RUN npm install -g npm@latest --force
RUN npm install

COPY . .
COPY .env.prod .env

RUN npm run build
RUN npm run migrate
RUN npm run seed

EXPOSE 8001

CMD [ "npm", "run", "start" ]