"use strict";

class UserRoom{
    constructor(){
    }

    /**
	* Add new user both main room and game rooms
	*
	*  TODO - remove div string names. Replace it for a parameter like _AllConnectedUsersDiv and _userBoxDiv
    */
	static addNewUser(_userData){

	  console.log('addNewUser | remove user???');

	  console.log(_userData);
	  console.log(currentRoom);

	  var userRoom = _userData.roomId;
	  var userId = _userData.userId;

	  userId = Util.removeInvalidIdChars(userId);

	  console.log(userRoom +'=='+ currentRoom);

	  //alert(currentRoom);

	  var option = '<div id="'+ userId +'">' + userId + '</div>';
	  
	  if(userRoom == 'mainRoom'){
	    $('#mainRoom').find("#allConnectedUsers").append(option);
	  }else{
	    console.log('add user ' + userId + ' to userbox');
	    $('#userContainer').find("#usersBox").append(option);

	  }
	}
	/**
	* 
	*/
	static removeUser(_userData){

	  console.log('removeUser');
	  console.log(_userData);

	  var userId = _userData.userId;
	  var roomId = _userData.roomId;

	  userId = Util.removeInvalidIdChars(userId);
	  roomId = Util.removeInvalidIdChars(roomId);
	  // remove invalid chars

	  console.log(userId);
	  console.log(roomId);

	  if(currentRoom == 'mainRoom'){

	    $("#mainRoom").find("#allConnectedUsers").find("#" + userId).remove();
	    $("#mainRoom").find("#allConnectedRooms").find("#" + roomId).remove();

	  }

	  console.log(currentRoom + '==' + roomId);
	  if(currentRoom == roomId){
	    $('#userContainer').find("#usersBox").find(userId).remove();

	  }
	  // TODO - call this method
	  //verifyGamePositions(userId);

	}	 

	
}