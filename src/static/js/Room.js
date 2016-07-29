"use strict";

class Room{
    constructor(socket){
    	this.socket = socket;
    }

    /**
	* add new room.
	*	TODO remove div names. replace them for variables
    */
    static addNewRoom(_roomData){
	  console.log('addNewRoom');
	  console.log(_roomData);

	  var userIdOwner = _roomData.userIdOwner;
	  var roomId = _roomData.roomId;

	  if(currentRoom == 'mainRoom'){
	    var option = '<div id="'+ Util.removeInvalidIdChars(roomId) +'">' + '<a href="javascript:joinRoom(\''+roomId+'\')">'+roomId + '</a></div>';

	    $("#mainRoom").find("#allConnectedRooms").append(option);
	    $('#mainRoom').find("#allConnectedUsers").find("#" + Util.removeInvalidIdChars(userIdOwner)).remove(); 
	  }    	
    }
	
}