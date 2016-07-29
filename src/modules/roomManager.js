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

var method = RoomManager.prototype;


function RoomManager(io, chessBoard, allRooms){
	this.io = io;
  this.chessBoard = chessBoard;
  this.allRooms = allRooms;
}

method.joinRoom = function (_socketData, socket) {

    var users = [];
    var rooms = [];

    var allConnectedRooms=[];

    var ns = this.io.of("/"); 

    for (var id in ns.connected) {
      users.push(id);
      
      for (var roomByUserId in ns.connected[id].rooms) {
          var roomStr = ns.connected[id].rooms[roomByUserId]; 
          var n = roomStr.search("room_");
          if(n == 0){
            allConnectedRooms[roomStr] = true;
          }
      }

    }

    rooms = Object.keys(allConnectedRooms);
    socket.emit('clientList', {users: users, userId: socket.id, rooms:rooms});

};
method.changeRoom = function (_userData) {

    var userId =  _userData.userId;
    var roomId =  _userData.roomId;

    var playerA = this.allRooms[roomId].playerA;
    var playerB = this.allRooms[roomId].playerB;
    var guests = null;

    playerB == null? playerB = userId: this.allRooms[roomId].playerB;

    var roomUsersData = {playerA:playerA, playerB:playerB, guests:guests};


    var socket = this.io.sockets.connected[userId];
    console.log(socket);

    var socketOwnerRoom = this.io.sockets.connected[_userData.roomId.replace('room_','')];

    socket.broadcast.emit('userJoinRoom', {userId:socket.id, roomUsersData:roomUsersData});
    socketOwnerRoom.emit('startGame', {gameStarted:true, roomUsersData:roomUsersData});

    this.chessBoard.defineBoardSeats(socket, roomId, 'joinRoom', this.allRooms);	
};

method.createRoom = function (_userData) {

    var socket = this.io.sockets.connected[_userData.userId];

    var _roomId = _userData.roomId;
    var _playerA = _userData.userId;

    
    socket.join(_roomId);

    this.allRooms[_roomId] = {playerA:_playerA, playerB:null, guests:null};
    this.chessBoard.defineBoardSeats(socket, _roomId, 'createRoom', this.allRooms);

    console.log('newRoomAdded');
    socket.broadcast.emit('newRoomAdded', {roomId: _roomId, userIdOwner: _playerA});
 
};

module.exports = RoomManager;