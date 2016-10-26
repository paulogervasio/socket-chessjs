"use strict";

class UserRoom{
    constructor(currentRoom, app){
    	this.currentRoomStrName = currentRoom;
    	this.app = app;
    }

    /**
	* Add new user both main room and game rooms
	*
	*  TODO - remove div string names. Replace using a parameter like _AllConnectedUsersDiv and _userBoxDiv
    */
	addNewUser(_userData){

	  console.log('addNewUser ------------------------');
	  console.log(_userData);
	  console.log(this.currentRoomStrName);

	  var userRoom = _userData.roomId;
	  var userId = _userData.userId;

	  userId = Util.removeInvalidIdChars(userId);

	  console.log(userRoom +'=='+ this.currentRoomStrName);

	  //var option = '<div id="'+ userId +'">' + userId + '</div>';
	  var option = '<li id="' + userId+ '" class="list-group-item">'+ userId + '</li>';
	  
	  if(userRoom == 'mainRoom'){
	    $('#mainRoom').find("#allConnectedUsers").find(".list-group").append(option);
	  }else{
	    console.log('add user ' + userId + ' to userbox');
	    $('#userContainer').find("#usersBox").append(option);

	  }
	}
	/**
	* 
	*/
	removeUser(_userData){

	  console.log('removeUser');
	  console.log(_userData);

	  var userId = _userData.userId;
	  var roomId = _userData.roomId;

	  userId = Util.removeInvalidIdChars(userId);
	  roomId = Util.removeInvalidIdChars(roomId);
	  // remove invalid chars

	  console.log(userId);
	  console.log(roomId);
	  console.log(this.roomName);
	  

	  if(this.currentRoomStrName == 'mainRoom'){

	    $("#mainRoom").find("#allConnectedUsers").find("#" + userId).remove();
	    $("#mainRoom").find("#allConnectedRooms").find("#" + roomId).remove();

	  }

	  console.log(this.currentRoomStrName + '==' + roomId);
	  if(this.currentRoomStrName == roomId){
	    $('#userContainer').find("#usersBox").find(userId).remove();

	  }
	  // TODO - call this method
	  //this.app.verifyGamePositions(userId);

	}	 

	
}