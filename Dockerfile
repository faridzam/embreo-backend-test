FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm cache clean --force
RUN npm install -g npm@latest --force
RUN npm install

COPY . .

RUN npm run build:prod

EXPOSE 8001

CMD [ "npm", "run", "deploy" ]