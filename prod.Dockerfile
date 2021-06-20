#build stage
FROM node:14-alpine AS build

ENV NODE_ENV=production

RUN mkdir code
WORKDIR /code

RUN mkdir client
COPY ./client/package-lock.json ./client/package.json ./client/
RUN cd client && npm ci
COPY ./client ./client
RUN cd client && npm run build

RUN mkdir server
COPY ./server/package-lock.json ./server/package.json ./server/
RUN cd server && npm ci
COPY ./server ./server

# runtime stage
FROM alpine:3.14

ENV NODE_ENV=production

RUN apk add --update nodejs-current
RUN addgroup -S node && adduser -S node -G node
USER node

RUN mkdir /home/node/code
WORKDIR /home/node/code

RUN mkdir build/
COPY --from=build --chown=node:node /code/client/build ./build
COPY --from=build --chown=node:node /code/server .

CMD ["node" , "index.js"]