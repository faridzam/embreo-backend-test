FROM node:22-alpine

WORKDIR /app

ENV ORIGIN=http://embreo-frontend-test.faridzam.com
ENV PORT=8001
ENV DB_USER=faridzam
ENV DB_PASSWORD=password
ENV DB_HOST=89.116.32.70
ENV DB_PORT=5432
ENV DB_NAME=embreo-test
ENV JWT_SECRET=8d12293f120797397f26bc8835440245a4b0c9f09ffe5ca888c701ac2d215a28

COPY package*.json ./

RUN npm cache clean --force
RUN npm install -g npm@latest --force
RUN npm install

COPY . .

RUN npm run build:prod

EXPOSE 8001

CMD [ "npm", "run", "deploy" ]