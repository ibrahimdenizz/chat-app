FROM node:14-alpine

RUN npm i -g nodemon

RUN mkdir code
WORKDIR /code

COPY . .

RUN npm ci

CMD ["npm", "run", "dev"]