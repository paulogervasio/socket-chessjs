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


function RoomManager(io){
	this.io = io;
}
method.joinRoom = function (_socketData, socket) {
    console.log('************ Joined!!');
    console.log('join');

    //console.log('joined');

    console.log(_socketData.userName, _socketData.roomName);

    var users = [];
    var rooms = [];

    var allConnectedRooms=[];

    var ns = this.io.of("/"); 

    console.log('all users connected');

    for (var id in ns.connected) {
      console.log(id);
      //console.log("roomName:" + ns.connected[id].rooms[1]);
      users.push(id);
      //console.log('room id:');
      //console.log(ns.connected[id].rooms);

      
      for (var roomByUserId in ns.connected[id].rooms) {
          
          //console.log('roomByUserId ==============================');
          //console.log(ns.connected[id].rooms[roomByUserId]);

          var roomStr = ns.connected[id].rooms[roomByUserId]; 
          var n = roomStr.search("room_");
          if(n == 0){
            //console.log('add to allConnectedRooms =++++++++++++++++++++++++++');
            //console.log(roomStr);
            allConnectedRooms[roomStr] = true;
          }
      }

    }

    //console.log('ALL CONNECTED ROOMS ***********************************');
    rooms = Object.keys(allConnectedRooms);

    //console.log('io.sockets.adapter.rooms');
    // console.log(io.sockets.adapter.rooms);

    //console.log('send clientList');
    socket.emit('clientList', {users: users, userId: socket.id, rooms:rooms});
  

};

module.exports = RoomManager;

