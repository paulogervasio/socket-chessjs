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



app.use('/chess', express.static(__dirname + '/chess'));
app.use('/static', express.static(__dirname + '/static'));


var allUsers = [];
var allRooms = [];

var RoomManager = require('./roomManager.js');

var roomManager = new RoomManager(io);


// replaced by dictionary room
//var playerA = null;
//var playerB = null;


app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/chessboard', function(req, res){
  res.sendFile(__dirname + '/chess/index.html');
});


/**
* asdsa
*/
function defineBoardSeats(_socket, _roomId, _flagRoom){

  var socketRoomId = _roomId;

  var playerA = allRooms[socketRoomId].playerA;
  var playerB = allRooms[socketRoomId].playerB;

  _socket.join(socketRoomId);
  _socket.room = socketRoomId;

  console.log('defineBoardSeats');
  console.log(_socket.room);

  console.log(playerA);

  if(_flagRoom == 'createRoom'){
    console.log('PlayerA is ' + _socket.id);
    _socket.emit('boardConfig', {userId:_socket.id, roomId:socketRoomId, side: 'A'});

  } else{
    // joinRoom
    if(playerB == null){
      // player B joined in room
      console.log('PlayerB is ' + _socket.id);
      allRooms[socketRoomId].playerB=_socket;
      _socket.emit('boardConfig', {userId:_socket.id, roomId:socketRoomId, side: 'B'});
    }else{
      // GUESTS
      console.log('GUEST');
      _socket.emit('boardConfig', {userId:_socket.id, roomId:socketRoomId, side: 'GUEST'});
    }

  }

}


io.on('connection', function(socket){

      
      console.log('connected');

      //console.log('userName:' + _userName + ' connected');
      console.log('session id:' + socket.id);

      //console.log('room_' + socket.id.toString());

      socket.join('mainRoom');
      socket.room = 'mainRoom';

      // AFTER SELECT THE ROOM
      //defineBoardSeats(socket);
      
      allUsers.push(socket);


      console.log('newUserAdded');
      console.log(socket.room);

      socket.broadcast.emit('newUserAdded', {userId:socket.id,roomId:'mainRoom'});
      socket.on('join', function(_socketData){
        roomManager.joinRoom(_socketData, socket);
      }
);
     



  socket.on('sendPiecePosition', function(_piecePosition){
    //io.emit('recei', msg);

    console.log('sendPiecePosition');
    console.log(_piecePosition);
    console.log(socket.room);
    console.log(_piecePosition.roomID);

    socket.broadcast.to(_piecePosition.roomID).emit('receivePiecePosition', _piecePosition);
    

  });

  socket.on('createRoom', function(_userData){
    //io.emit('recei', msg);

    var _roomId = _userData.roomId;
    var _playerA = _userData.userId;

    console.log('createRoom:' + _userData.roomId);
    socket.join(_roomId);

    allRooms[_roomId] = {playerA:_playerA, playerB:null, guests:null};


    console.log("_roomId: " + _roomId);
    console.log("playerA: " + allRooms[_roomId].playerA);

    console.log(allRooms);

    console.log("_userData");
    console.log(_userData);

    defineBoardSeats(socket, _roomId, 'createRoom');

    console.log('newRoomAdded');
    socket.broadcast.emit('newRoomAdded', {roomId: _roomId, userIdOwner: _playerA});
    



  });

  socket.on('changeRoom', function(_userData){

    console.log('changeRoom');

    var userId =  _userData.userId;
    var roomId =  _userData.roomId;

    var socket = io.sockets.connected[userId];
    var socketOwnerRoom = io.sockets.connected[_userData.roomId.replace('room_','')];

    socket.broadcast.emit('userJoinRoom', {userId:socket.id});
    socketOwnerRoom.emit('startGame', {gameStarted:true});

    console.log(socket.id);
    defineBoardSeats(socket, roomId, 'joinRoom');

    ////////////////////////////////////////////////

  });


  socket.on('chat message', function(msg){

    console.log(socket.room);
    socket.broadcast.emit('chat message', msg);

  });

  socket.on('disconnect', function(){
    console.log('disconnect');
    console.log(socket.room);

    socket.broadcast.emit('removedUser', {userId:socket.id,roomId:socket.room});

    allUsers.splice(allUsers.indexOf(socket), 1);

  });

    socket.once('disconnect', function (_user) {


       console.log('DISCONECTED');

       console.log(socket.room);


    });  


});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

                                                                                                              