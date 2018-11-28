FROM node:8.12-alpine

WORKDIR /src

COPY /src .

RUN npm install yarn
RUN yarn install --production=true

EXPOSE 8080

CMD yarn run docs
CMD yarn start
