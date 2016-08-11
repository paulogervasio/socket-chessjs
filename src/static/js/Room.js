"use strict";

class Room{
    constructor(myUserId, currentRoomStrName, userRoom){
    	this.myUserId = myUserId;
    	this.currentRoomStrName = currentRoomStrName;
    	this.userRoom = userRoom;
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

	  if(this.currentRoomStrName == 'mainRoom'){
	  	Room.createRoomButtonLink({roomId:roomId})

	    $('#mainRoom').find("#allConnectedUsers").find("#" + Util.removeInvalidIdChars(userIdOwner)).remove(); 
	  }    	
    }

    static createRoomButtonLink(_roomData){

    	var roomId = Util.removeInvalidIdChars(_roomData.roomId); // stripped
    	var hrefLink = '<a href="javascript:app.joinRoom(\''+_roomData.roomId+'\')">'+roomId;
    	var option = '<li id="' + roomId+ '" class="list-group-item">'+ hrefLink + '</li>';

	    $("#mainRoom").find("#allConnectedRooms").find(".list-group").append(option);    	
    }


	static listAllAvailableRooms(roomList, clientList){
	  // list all available rooms
	  for(var i=0;i<roomList.length;i++){

	    if(roomList[i] != 'mainRoom'){
	      //
	      var selectedRoom = roomList[i]; 
	      //

	      var userRoomOwner = selectedRoom.replace('room_','');

	      // remove user room owner from main room
	      var index = clientList.indexOf(userRoomOwner);
	      clientList.splice(index, 1);
	      //

	      //var option = '<div id="'+ Util.removeInvalidIdChars(selectedRoom) +'">' + '<a href="javascript:app.joinRoom(\''+selectedRoom+'\')">'+selectedRoom + '</a></div>';
	      //$("#mainRoom").find("#allConnectedRooms").append(option);

		  Room.createRoomButtonLink({roomId:selectedRoom});

	      $('#mainRoom').find("#allConnectedUsers").find("#" + Util.removeInvalidIdChars(userRoomOwner)).remove(); 
	    }
	  }

	}

	static listAllAvailableClients(roomList, clientList, _list, userRoom){
	  // list all available clients

	  for(var i=0;i<clientList.length;i++){

	    if(clientList[i] != _list.userId){

	      var _id = clientList[i];

	      var userId = Util.removeInvalidIdChars(_id);
	      
	      userRoom.addNewUser({roomId:'mainRoom', userId:userId});
	    }
	  }
	}	
}