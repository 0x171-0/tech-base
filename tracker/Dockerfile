FROM node:latest

RUN mkdir -p /app
WORKDIR /app

COPY /server/package*.json server/

RUN cd server; npm i && npm cache clean --force 

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

COPY . /app

ENTRYPOINT ["sh", "./scripts/entry.sh" ]

EXPOSE 7000

# CMD cd server; npm run start
