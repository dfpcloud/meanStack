FROM node:7.2.0-alpine

WORKDIR /app
COPY . .
RUN npm install
RUN bower install

# if we don't use this specific form, SIGINT/SIGTERM doesn't get forwarded
CMD node server.js