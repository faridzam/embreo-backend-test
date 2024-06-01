FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm cache clean --force
RUN npm install -g npm@latest --force
RUN npm install

COPY . .

RUN npm run build:prod
RUN npm run migrate:prod
RUN npm run seed:prod

EXPOSE 8001

# CMD [ "npm", "run", "start:prod" ]
CMD ["/bin/bash", "-c", "echo npm run migrate:prod;echo npm run seed:prod;echo npm run start:prod"]