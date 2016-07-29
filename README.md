# Socket-chessjs

A simple socket app using nodejs and javascript and Docker.


TODO
 - Generate Tests
 - Docker file to deploy
 - Design UI
 - Storage for matches
 - Tests / front and backend


## How to install

Create a directory to host the Dockerfile:
mkdir sockchess;
cd sockchess;




docker build -t=paulogervasio/socket-chess .;
docker run -ti -p 3000:3000 paulogervasio/socket-chess;



Now access application from browser typing http://<hostname>:3000/ and have fun!

