"use strict";

class Room{
    constructor(myUserId, currentRoom){
    	this.myUserId = myUserId;
    	this.currentRoom = currentRoom;
    }

    /**
	* add new room.
	*	TODO remove div names. replace them for variables
    */
    addNewRoom(_roomData){
	  console.log('addNewRoom');
	  console.log(_roomData);

	  var userIdOwner = _roomData.userIdOwner;
	  var roomId = _roomData.roomId;

	  if(this.currentRoom == 'mainRoom'){
	    var option = '<div id="'+ Util.removeInvalidIdChars(roomId) +'">' + '<a href="javascript:app.joinRoom(\''+roomId+'\')">'+roomId + '</a></div>';

	    $("#mainRoom").find("#allConnectedRooms").append(option);
	    $('#mainRoom').find("#allConnectedUsers").find("#" + Util.removeInvalidIdChars(userIdOwner)).remove(); 
	  }    	
    }


	static listAllAvailableRooms(roomList, clientList){
	  // list all available rooms
	  for(var i=0;i<roomList.length;i++){

	    if(roomList[i] != 'mainRoom'){
	      //
	      var selectedRoom = roomList[i]; 
	      var option = '<div id="'+ Util.removeInvalidIdChars(selectedRoom) +'">' + '<a href="javascript:app.joinRoom(\''+selectedRoom+'\')">'+selectedRoom + '</a></div>';
	      //

	      var userRoomOwner = selectedRoom.replace('room_','');

	      // remove user room owner from main room
	      var index = clientList.indexOf(userRoomOwner);
	      clientList.splice(index, 1);
	      //

	      $("#mainRoom").find("#allConnectedRooms").append(option);
	      $('#mainRoom').find("#allConnectedUsers").find("#" + Util.removeInvalidIdChars(userRoomOwner)).remove(); 
	    }
	  }

	}

	static listAllAvailableClients(roomList, clientList, _list){
	  // list all available clients

	  for(var i=0;i<clientList.length;i++){

	    if(clientList[i] != _list.userId){

	      var _id = clientList[i];

	      var userId = Util.removeInvalidIdChars(_id);
	      //
	      var option = '<div id="'+ userId +'">' + userId + '</div>';
	      $('#mainRoom').find("#allConnectedUsers").append(option);
	    }
	  }
	}

   


	
}