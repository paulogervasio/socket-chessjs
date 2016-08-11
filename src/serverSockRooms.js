/*
 * Copyright (c) 2016, Paulo Gervasio (pgervasiosousa@gmail.com)
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 *    this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 *
 *----------------------------------------------------------------------------*/


var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


var express = require('express');
var path = require('path');



app.use('/chess', express.static(__dirname + '/static/chess'));
app.use('/static', express.static(__dirname + '/static'));


var allUsers = [];
var allRooms = [];

var RoomManager = require('./modules/roomManager.js');
var ChessBoard = require('./modules/chessBoard.js');
var SocketManager = require('./modules/socketManager.js');

var chessBoard = new ChessBoard();
var roomManager = new RoomManager(io, chessBoard, allRooms);
var socketManager = new SocketManager(roomManager);


app.get('/', function(req, res){
  res.sendFile(__dirname + '/static/index.html');
});

app.get('/chessboard', function(req, res){
  res.sendFile(__dirname + '/static/chess/index.html');
});


io.on('connection', function(socket){

  // config socket events
  socketManager.configEvents(socket, roomManager);

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

                                                                                                              
