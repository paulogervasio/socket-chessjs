"use strict";

class ChessBoardMoves{
    constructor(currentRoom){
    	this.currentRoom = currentRoom;
    }

    /**
	* TODO remove divs
    */
	static receivePiecePosition(_move){
	  console.log('sendPiecePosition received');
	  var $f = $("#gameContainer");
	  $f.get(0).contentWindow.movePiece(_move);

	  
	}


	initGame(_boardData){
	 // alert('initGame' + _boardData.side);

	  $('#gameContainer').attr('src', "chess/");

	  //alert('initGame');
	  $('#gameContainer').load(function(){
	    //alert('loaded');

	    var $f = $("#gameContainer");
	    $f.get(0).contentWindow.configureChessGame(_boardData.side, this.currentRoom);

	    if(_boardData.side != 'A'){
	      $f.get(0).contentWindow.changeRoomId(_boardData.roomId);
	    }

	  });
	}

	startChessGame(_gameData){
	  //alert('Start chess game: ' + _statusGame);

	  console.log('Starting Game ##############################');
	  console.log(_gameData);

	  var $f = $("#gameContainer");
	  $f.get(0).contentWindow.startChessGame();

	}        
	
}