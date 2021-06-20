FROM node:14-alpine

RUN mkdir code
WORKDIR /code

COPY . .

RUN npm ci

CMD [ "npm", "start" ]