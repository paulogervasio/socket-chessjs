# Socket-chessjs

A chess multiplayer game with nodejs + javascript + Docker.


TODO
 - Design UI
 - Storage for matches (to historical analysis)
 - Tests / front and backend
 - Mobile version
 - Auth system
 - Refactor front-end javascript (initial idea is to implement Angularjs)




## How to install

Create a directory to host the Dockerfile and download it:
```
mkdir sockchess;
cd sockchess;
wget https://raw.githubusercontent.com/paulogervasio/socket-chessjs/master/Dockerfile;
```


After download the file, execute the following commands:

```
docker build -t=paulogervasio/socket-chess .;
docker run -ti -d -p 3000:3000 paulogervasio/socket-chess;
```

Now access application; In your favorite from browser type: http://[your_hostname:3000]/ and have fun!

