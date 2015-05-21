var numPlayer;
var maxPlayers;
var sockets;
var players;

Meteor.startup(function(){
  // Server setup
  console.log('Server startup');
  
  maxPlayers = 5;
  players = {};
  for ( var i = 0; i < maxPlayers; i++ ){
    players[i] = "free";
  }
  
  // Other
  numPlayer = 0;
});

Streamy.onConnect(function(socket) {
  //console.log('User joined ('+ socket.id + ')');
  // Lògica d'assignar index
  var trobat = 0;
  for ( var i = 0; i < maxPlayers; i++ ){
    if ( players[i] == "free" ){
      if ( !trobat ){
        trobat = 1;
        players[i] = { "index" : i, "id" : socket.id, "phase" : "phase", "isMoving" : 0};
        Streamy.emit('welcome', { index: i, maxplayers: maxPlayers }, socket);
        console.log('Index ' + i + ' assigned.');          
        // Notificar als altres
        Streamy.broadcast('showBird', { index : i}); 
      }   
    }
    else{
      //console.log('Show this bird ' + i);
      Streamy.emit('showBird', { index : i}, socket);
    }
  }
  
  if ( trobat === 0){
    // No hi ha lloc per un nou client
    console.log('Player list full.');
  }
});

Streamy.onDisconnect(function(socket) {
  //console.log('User left (' + socket.id + ')');
  // Lògica de user left
  var trobat = 0;
  for ( var i = 0; i < maxPlayers; i++ ){
    if ( !trobat ){
       if ( players[i].id == socket.id ){
         trobat = 1;
         console.log('Index ' + i + ' freed.');
         players[i] = "free";
         
         Streamy.broadcast('hideBird', { index : i});
      }
    }
  }
});

// Other stuff
Streamy.BroadCasts.allow = function(data, from) {
  // from is the socket object
  // data contains raw data you can access:
  //  - the message via data.__msg
  //  - the message data via data.__data

  return true;
};
Streamy.DirectMessages.allow = function(data, from, to) {
  // from is the socket object
  // to is the recipient socket object
  // data contains raw data you can access:
  //  - the message via data.__msg
  //  - the message data via data.__data

  return true;
};

Streamy.on('hello', function(d, s) {
  console.log(d.data); // Will print 'world!'

  // On the server side only, the parameter 's' is the socket which sends the message, you can use it to reply to the client, see below
});


Streamy.on('gameAction', function(data,socket){
  //console.log(data.id + ' just ' + data.action + '!');
});

Streamy.on('KeyDown', function(data, socket) {
  switch (data.data){
    case '1':
      console.log('1');
      break;
    case '3':
      sockets = Streamy.sockets();
      console.log('Sockets tal qual:');
      console.log(sockets);
      break;
    case '4':
      sockets = Streamy.sockets();
      console.log('Number of clients [_.size(sockets)]: ' + _.size(sockets));
      break;
    case '5':
      sockets = Streamy.sockets();
      console.log('Ids dels clients [_.keys(sockets)]: ' + _.keys(sockets));
      break;
    case '6':
      sockets = Streamy.sockets();
      console.log('Values dels clients [_.values(sockets)]: ' + _.values(sockets));
      console.log(_.values(sockets));
      break;
    default:
      console.log('unidentified KeyDown');
      break;
  }
});