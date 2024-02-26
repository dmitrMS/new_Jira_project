FROM node:18-alpine

WORKDIR /app

RUN apk add openssl

#  copy package.json, install packages and copy sources
COPY package*.json ./

RUN npm install

COPY . .

RUN apk add openssl

CMD ["npm", "run", "start"]