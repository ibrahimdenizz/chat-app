FROM node:14-alpine

RUN mkdir code
WORKDIR /code

COPY package-lock.json package.json  ./

RUN npm ci

CMD [ "npm", "start" ]