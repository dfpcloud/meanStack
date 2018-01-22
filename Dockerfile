FROM node:7.2.0-alpine

WORKDIR /app
COPY . .
RUN npm install
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh
RUN npm install -g bower
RUN bower install --allow-root

# if we don't use this specific form, SIGINT/SIGTERM doesn't get forwarded
CMD node server.js
