'use strict';

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

"use strict";

class App{


    constructor(){
      this.userName = 'myUsername';
      this.myUserId;

      this.currentRoom = 'mainRoom';
      this.roomName = 'myRoomName';

      this.playerA;
      this.playerB;
      this.guests = [];

      this.socket = null;

      this.divMessages = '#messages';
      this.mainRoom = '#mainRoom';
      this.allConnectedUsers = '#allConnectedUsers';

      this.chatContainer = '#chatContainer';
      this.gameContainer = '#gameContainer'; 
      this.chatCredentials = '#chatCredentials'; 

      this.socket = null;

      this.self = this;

      this.chessBoardMoves = new ChessBoardMoves(this.currentRoom);
      this.room = new Room(this.myUserId, this.currentRoom);

      this.userRoom = new UserRoom(this.currentRoom, this);

    }

    configSocket(){

        var self = this;

        console.log('configSocket');
        this.socket = io();        

        chatInitalized = true;


        //alert('userName' + userName);
        this.socket.emit('join', {userName:this.userName, roomName:this.roomName});

        $('form').submit(function(){
            self.socket.emit('chat message', $('#inputMessageField').val());
            
            $("#messages").append($('<li>').text($('#inputMessageField').val()));
            $('#inputMessageField').val('');

            return false;
        });

        this.socket.on('chat message', function(msg){
          console.log(msg);
          $("#messages").append($('<li>').text(msg));
        });

        this.socket.on('newUserAdded', function(_userData){
          self.userRoom.addNewUser(_userData);
        });

        this.socket.on('userJoinedInRoom', function(_userData){
          self.userJoinedInRoom(_userData);
        });

        this.socket.on('newRoomAdded', function(_roomData){
          self.room.addNewRoom(_roomData);
        });


        this.socket.on('startGame', function(_statusGame){
          self.chessBoardMoves.startChessGame(_statusGame);
        });

        
        this.socket.on('listAllUsersInMainRoom', function(_list){
          self.listAllUsersInMainRoom(_list);
        });


        this.socket.on('removedUser', function(_userData){
          self.userRoom.removeUser(_userData);
        });

        this.socket.on('boardConfig', function(_boardData){
            //alert(_boardConfig.side);

          $(gameContainer).show();
          $(chatContainer).show();

          $(chatCredentials).hide();
          $(mainRoom).hide();

          console.log('BOARD CONFIG');
          console.log(_boardData);
            

          this.currentRoom = 'room_' + _boardData.userId;

          //alert( _boardData.userId);

          self.userRoom.addNewUser(_boardData);
          self.chessBoardMoves.initGame(_boardData);

        });

        this.socket.on('receivePiecePosition', function(_piecePosition){
            console.log('receivePiecePosition')
            ChessBoardMoves.receivePiecePosition(_piecePosition);
        });        

        //$('#formSender').find("#m").focus();
    }

    listAllUsersInMainRoom(_list){
      console.log('clientList');

      var clientList = _list.users;
      var roomList = _list.rooms;

      console.log(_list.userId);
      this.myUserId = _list.userId;

      $("#userIdLabel").text('My id is: [' + _list.userId + ']');

      Room.listAllAvailableRooms(roomList, clientList);
      Room.listAllAvailableClients(roomList, clientList, _list);
     
    }     


    initApp(){


        $(gameContainer).hide();

        $(chatCredentials).hide();
        $(chatContainer).hide();

        this.configSocket();
        

    }


    joinRoom(_roomId){
      //alert(myUserId + '||' +_roomId);

      console.log(this.myUserId);
      console.log(_roomId);
      this.socket.emit('changeRoom', {userId:this.myUserId, roomId:_roomId});
      
    }

    userJoinedInRoom(_userData){

      console.log('userJoinedIRoom');
      console.log(_userData);

      this.playerA = _userData.roomUsersData.playerA;
      this.playerB = _userData.roomUsersData.playerB;

      console.log(this.playerA);

      // remove user from main room
      var userId = Util.removeInvalidIdChars(_userData.userId);
      $(mainRoom).find(allConnectedUsers).find("#" + userId).remove(); 

      /*// TODO - add user to joined room list
      var option = '<div id="'+ userId +'">' + userId + '</div>';
      $('#userContainer').find("#usersBox").append(option); 
      */

    }



    /**
      Verify after a user quited is a player of the game.
      Case its true the game is aborted.
    */
    verifyGamePositions(userId){

      var playerA = this.playerA;
      var playerB = this.playerB;

      console.log('Verify Game Positions');
      console.log(playerA);
      console.log(playerB != undefined);
      console.log(userId);
      console.log(Util.removeInvalidIdChars(playerA));

      if((playerA != undefined && playerB != undefined) && userId == Util.removeInvalidIdChars(playerA) || userId == Util.removeInvalidIdChars(playerB)){
         alert('A player exited. The game has not enough players to continue and will be aborted.');
         App.exitRoom();
      }  

    }



    sendPiecePosition(_move){
      console.log('sendPiecePosition');
      console.log(_move);
      _move.roomID = this.currentRoom;
      this.socket.emit('sendPiecePosition', _move);
    }

    createMyRoom(){
      console.log('createMyRoom');
      console.log(this.myUserId);
      var _roomId = 'room_' + this.myUserId; 
      this.socket.emit('createRoom', {roomId:_roomId, userId:this.myUserId});

    }

    static exitRoom(){
      location.reload();
    }
}