FROM node:18

WORKDIR /opt/app

COPY . .

RUN npm install

CMD node receive.js

# docker build --build-arg file=receive.js -t kaylleur/send-amqp .
# docker build --build-arg file=send.js -t kaylleur/receive-amqp .
