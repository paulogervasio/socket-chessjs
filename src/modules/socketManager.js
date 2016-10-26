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

var method = SockeManager.prototype;


function SockeManager(roomManager){
	this.roomManager = roomManager;
	self = this;
}


method.configEvents = function (socket, roomManager) {


  socket.join('mainRoom');
  socket.room = 'mainRoom';


  socket.broadcast.emit('newUserAdded', {userId:socket.id,roomId:'mainRoom'});
  socket.on('join', function(_socketData){
      self.roomManager.joinRoom(_socketData, socket);
    }
  );

  socket.on('createRoom', function(_userData){
    self.roomManager.createRoom(_userData);
  });  


  socket.on('sendPiecePosition', function(_piecePosition){

    console.log('sendPiecePosition');
    console.log(_piecePosition);
    console.log(socket.room);
    console.log(_piecePosition.roomID);

    socket.broadcast.to(_piecePosition.roomID).emit('receivePiecePosition', _piecePosition);
    

  });  

  socket.on('changeRoom', function(_userData){
    console.log('changeRoom');
    self.roomManager.changeRoom(_userData);
  });


  socket.on('chat message', function(msg){
    
    console.log('chat message');
    console.log(msg);

    socket.broadcast.emit('chat message', msg);

  });

  socket.on('disconnect', function(){
    console.log('disconnect');
    console.log(socket.room);

    socket.broadcast.emit('removedUser', {userId:socket.id,roomId:socket.room});

    console.log('this.roomManager');
    console.log(self.roomManager);
    console.log(socket.room);
    console.log(self.roomManager.allRooms[socket.room]);

    if(self.roomManager && self.roomManager.allRooms[socket.room]){

      console.log('He!');

      var playerA = self.roomManager.allRooms[socket.room].playerA;
      var playerB = self.roomManager.allRooms[socket.room].playerB;


      if(socket.id == playerA || socket.id == playerB.id){
        console.log('GAME CANCELLED - REMOVE THIS ROOM NOW!');
        socket.broadcast.to(socket.room).emit('quitRoom', '');
      }
    }

    //allUsers.splice(allUsers.indexOf(socket), 1);

  });


  socket.once('disconnect', function (_user) {
     console.log('DISCONECTED');
     console.log(socket.room);
  });    


};
module.exports = SockeManager;