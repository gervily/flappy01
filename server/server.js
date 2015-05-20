

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
  console.log(data.id + ' just ' + data.action + '!');
});

var sockets;

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

Streamy.onDisconnect(function(socket) {
  console.log('User left: ' + socket.id);
});

/*
/  onConnect
/  Quan un usuari es connecta se li
/  envia confirmació de que ha sigut rebut pel server
/  Quan el client ho rep, comença a crear el joc
*/
var numPlayer = 0;

Meteor.startup(function(){
  numPlayer = 0;
  console.log('Server startup');
});

Streamy.onConnect(function(socket) {
  console.log('User joined. Assignat el número ' + numPlayer);
  Streamy.emit('welcome', { index: numPlayer }, socket);
  numPlayer++;
});