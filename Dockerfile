FROM alpine
MAINTAINER Paulo Gervasio <http://github.com/paulogervasio>

RUN apk add --no-cache make gcc g++ python
RUN apk add --no-cache nodejs
RUN apk add --no-cache git
RUN apk add --no-cache npm; exit 0

WORKDIR "/root"
RUN mkdir git
WORKDIR "/root/git"
RUN git clone https://github.com/paulogervasio/socket-chessjs
WORKDIR "/root/git/socket-chessjs/src"
RUN pwd

RUN npm install express
RUN npm install socket.io

RUN apk del make gcc g++ python
RUN apk del git
RUN apk del npm; exit 0

EXPOSE 3000
CMD ["/usr/bin/node", "/root/git/socket-chessjs/src/serverSockRooms.js"]
