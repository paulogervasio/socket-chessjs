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

    //allUsers.splice(allUsers.indexOf(socket), 1);

  });


  socket.once('disconnect', function (_user) {
     console.log('DISCONECTED');
     console.log(socket.room);
  });    


};
module.exports = SockeManager;