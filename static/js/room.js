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




var userName = 'myUsername';
var myUserId;

var currentRoom = 'mainRoom';
var roomName = 'myRoomName';





var socket = null;

function configSocket(){

     socket = io();        

    chatInitalized = true;


    //alert('userName' + userName);
    socket.emit('join', {userName:userName, roomName:roomName});

    $('form').submit(function(){
      socket.emit('chat message', $('#m').val());
      
      $('#messages').append($('<li>').text($('#m').val()));

      $('#m').val('');
      return false;
    });
    socket.on('chat message', function(msg){
      $('#messages').append($('<li>').text(msg));
    });

    socket.on('newUserAdded', function(_userData){
      addNewUser(_userData);
    });

    socket.on('userJoinRoom', function(_userData){
      userJoinRoom(_userData);
    });

    socket.on('newRoomAdded', function(_roomData){
      addNewRoom(_roomData);
    });


    socket.on('startGame', function(_statusGame){
      startChessGame(_statusGame);
    });

    

    


    socket.on('clientList', function(_list){

        console.log('clientList');

        var clientList = _list.users;
        var roomList = _list.rooms;
        
        console.log(_list.userId);
        myUserId = _list.userId;

        $("#userIdLabel").text('My id is: [' + _list.userId + ']');


        // list all available rooms
        for(var i=0;i<roomList.length;i++){

          if(roomList[i] != 'mainRoom'){
            //
            var selectedRoom = roomList[i]; 
            var option = '<div id="'+ removeInvalidIdChars(selectedRoom) +'">' + '<a href="javascript:joinRoom(\''+selectedRoom+'\')">'+selectedRoom + '</a></div>';
            //

            //alert(selectedRoom);
            //alert(selectedRoom.replace('room_',''));

            var userRoomOwner = selectedRoom.replace('room_','');

            // remove user room owner from main room
            var index = clientList.indexOf(userRoomOwner);
            clientList.splice(index, 1);
            //

            $("#mainRoom").find("#allConnectedRooms").append(option);
            $('#mainRoom').find("#allConnectedUsers").find("#" + removeInvalidIdChars(userRoomOwner)).remove(); 
          }
        }


        // list all available clients
        
        for(var i=0;i<clientList.length;i++){

          if(clientList[i] != _list.userId){

            var _id = clientList[i];

            userId = removeInvalidIdChars(_id);
            //
            var option = '<div id="'+ userId +'">' + userId + '</div>';
            //var selectedOption = '<div id="room' + (i+1) +'">';
            //var option = selectedOption + clientList[i] + "</div>";
            //
            $('#mainRoom').find("#allConnectedUsers").append(option);
          }
        }
        

    });


    socket.on('removedUser', function(_userData){
        removeUser(_userData);
    });

    socket.on('boardConfig', function(_boardData){
        //alert(_boardConfig.side);

      $('#gameContainer').show();
      $('#chatContainer').show();

      $('#chatCredentials').hide();
      $('#mainRoom').hide();
        

      currentRoom = 'room_' + _boardData.userId;


      addNewUser(_boardData);
      initGame(_boardData);

    });

    socket.on('receivePiecePosition', function(_piecePosition){
        //alert('_piecePosition: ' + _piecePosition);
        //alert(_boardConfig.side);
        receivePiecePosition(_piecePosition);

    });        

    


    $('#formSender').find("#m").focus();

}


function initApp(){


    $('#gameContainer').hide();

    $('#chatCredentials').hide();
    $('#chatContainer').hide();

    configSocket();
    

}

function removeUser(_userData){


  console.log('Here');
  //console.log(_userData);
  var userId = _userData.userId;
  var roomId = _userData.roomId;

  userId = removeInvalidIdChars(userId);
  roomId = removeInvalidIdChars(roomId);
  // remove invalid chars

  if(currentRoom == 'mainRoom'){

    $("#mainRoom").find("#allConnectedUsers").find("#" + userId).remove();
    $("#mainRoom").find("#allConnectedRooms").find("#" + roomId).remove();
  }
  if(currentRoom == roomId){
    $('#userContainer').find("#usersBox").find(userId).remove();  
  }

}

function removeInvalidIdChars(_name){

  _name = _name.replace('/','');
  _name = _name.replace('#','');

  //alert(_name);
  return _name;

}

function joinRoom(_roomId){

  //alert(myUserId + '||' +_roomId);
  socket.emit('changeRoom', {userId:myUserId, roomId:_roomId});
  
}

function addNewRoom(_roomData){

  console.log('addNewRoom');
  console.log(_roomData);

  var userIdOwner = _roomData.userIdOwner;
  var roomId = _roomData.roomId;

  if(currentRoom == 'mainRoom'){
    var option = '<div id="'+ removeInvalidIdChars(roomId) +'">' + '<a href="javascript:joinRoom(\''+roomId+'\')">'+roomId + '</a></div>';

    $("#mainRoom").find("#allConnectedRooms").append(option);
    $('#mainRoom').find("#allConnectedUsers").find("#" + removeInvalidIdChars(userIdOwner)).remove(); 
  }

}

function userJoinRoom(_userData){
  $('#mainRoom').find("#allConnectedUsers").find("#" + removeInvalidIdChars(_userData.userId)).remove(); 
}


function addNewUser(_userData){

  console.log('addNewUser');

  console.log(_userData);
  console.log(currentRoom);

  var userRoom = _userData.roomId;
  var userId = _userData.userId;

  userId = removeInvalidIdChars(userId);


  console.log(userRoom +'=='+ currentRoom);


  //alert(currentRoom);

  var option = '<div id="'+ userId +'">' + userId + '</div>';
  
  if(userRoom == 'mainRoom'){
    $('#mainRoom').find("#allConnectedUsers").append(option);
  }else{
  //if(userRoom == currentRoom){
    $('#userContainer').find("#usersBox").append(option);
  }

}

function sendPiecePosition(_move){
  
  //alert('sendPiecePosition received');
  //console.log(_piecePosition);

  
  socket.emit('sendPiecePosition', _move);
}
function receivePiecePosition(_move){
  console.log('sendPiecePosition received');
  //alert('sendPiecePosition received');
  //alert(_piecePosition);
  //socket.emit('sendPiecePosition', _piecePosition);

  var $f = $("#gameContainer");
  $f.get(0).contentWindow.movePiece(_move);

  
}

function createMyRoom(){

  //alert('Create my room: room_' + userId);

  var _roomId = 'room_' + myUserId; 
  socket.emit('createRoom', {roomId:_roomId, userId:myUserId});


}

function initGame(_boardData){
  //$('#gameContainer').load("http://localhost:3000/chess/");
  //$('#gameContainer').call(initChessBoard());

 // alert('initGame' + _boardData.side);

  $('#gameContainer').attr('src', "chess/");

  //alert('initGame');
  $('#gameContainer').load(function(){
    //alert('loaded');

    var $f = $("#gameContainer");
    $f.get(0).contentWindow.configureChessGame(_boardData.side, currentRoom);

    if(_boardData.side != 'A'){
      $f.get(0).contentWindow.changeRoomId(_boardData.roomId);
    }

  });
}
function startChessGame(_statusGame){
  //alert('Start chess game: ' + _statusGame);
  var $f = $("#gameContainer");
  $f.get(0).contentWindow.startChessGame();

}        
