// Variables importants

var MeteorSurface = require('library/meteor/core/Surface');

var welcomeView, welcomeSurface;

var phase;
var sinCoef = 0;

var myIndex;
var maxPlayers;

var count = 0;
var isMoving = [];
var sinus = [];
var sinusDisp = [];
var birdImg = [];
var birdAlive = [];
//var birdImg = 1;
//var birdAlive = 1;
var birdSurfaceModifier = [];
var birdRotation = [];
var birdShowModifier = [];

var mainContext;
var qq;
var aux = [0,0];
var score = 0;
var scoresArray = [];
var scoreRanking = [];
var posicio;


var spaceMin = 52;
var spaceHeight = 250;
var heightFloor = 205;
var colWidth = 113;

var gameHeight;
var gameController;
var gameControllerModifier;

var gameView;
var startView;
var lostView;
var scoreView;
var scoreViewButton1, scoreViewButton2, scoreViewButton3, scoreViewSurface, scoreViewButtonOk;
var scoreViewButton1Modifier, scoreViewButton2Modifier, scoreViewButton3Modifier, scoreViewSurfaceModifier, scoreViewButtonOkModifier;
var gameBackgroundSurface;
var backgroundTop, backgroundBot, backgroundLeft, backgroundRight;
var backgroundTopModifier, backgroundBotModifier, backgroundLeftModifier, backgroundRightModifier;
var t1,t2,t3,t4;
var s1,s2,s3,s4;
var sf = [800,50], tf; // size i transform de floor
var clickSurface;
var clickSurfaceModifier;
var currentView;

var readySurface;
var readySurfaceModifier;

// Buttons
var buttonOkSurface;
var buttonOkSurfaceModifier;
var buttonScoreSurface;
var buttonScoreSurfaceModifier;

// Score
var scoreSurface = [];
var scoreSurfaceModifier = [];


var tick = 1700; // cada quan es llança
var time = 3000; // quan triga a arribar al final
var gameOn = false;
var numDegrees = 4; // Numero de steps de alçada de les Cols

var h_floor = 0.07;  
var h_space = 0.37;  // Espai que es deixa entre colTop i colBot [0,1]
var w_space = 0.09; // % de la width respecte el size del gameController [0,1]
var b_size = 0.067; // % size del bird respecte gameController [0,1]
var colQueue;
var colAux;

var prev1;
var gameControllerSize = [640,960];
var gameControllerAnchor = [];
var bgC = 'white';
var flC = 'orange';

var erasethis = 0;

var numCols = 4;
var numCol = 0;
var colTopSurface = [];
var colTopSurfaceModifier = [];
var colBotSurface = [];
var colBotSurfaceModifier = [];
var startSurface;
var floorSurface;
var floorSurfaceModifier;

// Physics
var physicsEngine;
var birdParticle = [];
var birdParticleMass = 2;
var birdParticleRadius = 30;
var birdParticleInitialPosition = [200,450,10]; // ignore
var birdParticlePosition = [0.5,0.5]; // en % respecte gameControllerSize
var birdParticleInitialVelocity = [0,0,0];
var gravity;
var gravityForce = [0,0.0056,0];
var floorWall;
var floorDistance = 800;
var birdSurface = [];
var birdPositionSurfaceModifier = [];
var birdRotationSurfaceModifier = [];
var birdSurfaceSize = [birdParticleRadius,birdParticleRadius];
var birdParticleVelocityClick = [0,-0.9,0];
var firstClick;
var gravityId = [];

var repeat;

// Altres variables
var dummySurface;
var dummyModifier;

var dummy = 0;

// Funcions
function setScore(number){

  if ( number == 10 ){
    // Shows scoreSurface[1] i pos
    scoreSurfaceModifier[0].setTransform(Transform.translate(299,50,100));
    scoreSurfaceModifier[1].setTransform(Transform.translate(341,50,100));
    scoreSurfaceModifier[1].setOpacity(1);
  }
  
  if ( number == 100 ){
    // Show scoreSurface[2] i pos
    scoreSurfaceModifier[0].setTransform(Transform.translate(278,50,100));
    scoreSurfaceModifier[1].setTransform(Transform.translate(320,50,100));
    scoreSurfaceModifier[2].setOpacity(1);
  }
  
  var str = score.toString();
  for (var i = 0; i < str.length; i++ ){
    //console.log('str[' + i + ']=' + str[i]);
    switch (str[i]){
      case '0':
        scoreSurface[i].setContent('img/zero.png');          
        break;
      case '1':
        scoreSurface[i].setContent('img/one.png');              
        break;
      case '2':
        scoreSurface[i].setContent('img/two.png');  
        break;
      case '3':
        scoreSurface[i].setContent('img/three.png');  
        break;
      case '4':
        scoreSurface[i].setContent('img/four.png');  
        break;
      case '5':
        scoreSurface[i].setContent('img/five.png');  
        break;
      case '6':
        scoreSurface[i].setContent('img/six.png');  
        break;
      case '7':
        scoreSurface[i].setContent('img/seven.png');  
        break;
      case '8':
        scoreSurface[i].setContent('img/eight.png');  
        break;
      case '9':
        scoreSurface[i].setContent('img/nine.png');  
        break;
    }
  }
}

function otherButtonOk(index, phase){
  if (index != myIndex){
    sinus[index] = true;
    birdRotation[index].set(0);
    birdParticle[index].setPosition(birdParticleInitialPosition);
    birdAlive[index] = 1;
    
    switch (phase){
      case 'loseScore':
        physicsEngine.detach(gravityId[index]);
        birdParticle[index].setVelocity([0,0,0]);
        sinusDisp[index].set(-50, {duration : 350, curve: Easing.outQuad}, function(){transIn(index);});
        break;
      case 'lose':
        physicsEngine.detach(gravityId[index]);
        birdParticle[index].setVelocity([0,0,0]);
        sinusDisp[index].set(-50, {duration : 350, curve: Easing.outQuad}, function(){transIn(index);});
        break;
    }
  }
}

function buttonOk(index){
  
  Streamy.emit('gameAction', {action: 'is ready', id: Streamy.id, index: myIndex, phase: phase});
  Streamy.broadcast('gameAction', {action: 'is ready', id: Streamy.id, index: myIndex, phase: phase});
  
  sinus[index] = true;
  birdRotation[index].set(0);
  birdParticle[index].setPosition(birdParticleInitialPosition);
  birdAlive[index] = 1;
  
  switch (phase){
    case 'startScore':
      if (index == myIndex){     
        // Anem a start. Posar condicions inicialsi   
        scoreSurface[0].setContent('img/zero.png');
        aux = [0,0];   
        scoreSurfaceModifier[0].setTransform(Transform.translate(320,50,100));
        scoreSurfaceModifier[1].setOpacity(0);
        scoreSurfaceModifier[2].setOpacity(0);
        score = 0;
        gameController.show(startView);
        Timer.after(function(){phase ='start';},5);   
      }   
      break;
    case 'loseScore':
      // Anem a start. Posar condicions inicials
      physicsEngine.detach(gravityId[index]);
      birdParticle[index].setVelocity([0,0,0]);
      sinusDisp[index].set(-50, {duration : 350, curve: Easing.outQuad}, function(){transIn(index);});
      
      if (index == myIndex){ 
        setColPosition();
        aux = [0,0];
        scoreSurfaceModifier[0].setTransform(Transform.translate(320,50,100));
        scoreSurfaceModifier[1].setOpacity(0);
        scoreSurfaceModifier[2].setOpacity(0);
        score = 0;
        scoreSurface[0].setContent('img/zero.png');
        gameController.show(startView);
        Timer.after(function(){phase ='start';},5);
      }
      break;
    case 'lose':
      // Anem a start. Posar condicions inicials
      physicsEngine.detach(gravityId[index]);
      birdParticle[index].setVelocity([0,0,0]);
      sinusDisp[index].set(-50, {duration : 350, curve: Easing.outQuad}, function(){transIn(index);});
      
      if (index == myIndex){ 
        setColPosition();
        aux = [0,0];
        scoreSurfaceModifier[0].setTransform(Transform.translate(320,50,100));
        scoreSurfaceModifier[1].setOpacity(0);
        scoreSurfaceModifier[2].setOpacity(0);
        score = 0;
        scoreSurface[0].setContent('img/zero.png');
        gameController.show(startView);
        Timer.after(function(){phase ='start';},5);
      }
      break;
  }
}

// Override Meteor._debug to filter for custom msgs
Meteor._debug = (function (super_meteor_debug) {
  return function (error, info) {
    if (!(info && _.has(info, 'msg')))
      super_meteor_debug(error, info);
  }
})(Meteor._debug);

function action(){
  // EngineClick, EngineSpace i EngineArrowUp
  switch (phase){
    case 'start':
      Streamy.emit('gameAction', {action: 'started', id: Streamy.id, index: myIndex});
      Streamy.broadcast('gameAction', {action: 'started', id: Streamy.id, index: myIndex});
      startToGame(myIndex);        
      break;
    case 'game':
      //flap
      Streamy.emit('gameAction', {action: 'flapped', timeElapsed: 30, id: Streamy.id, index: myIndex});
      Streamy.broadcast('gameAction', {action: 'flapped', timeElapsed: 30, id: Streamy.id, index: myIndex});
      birdFlap(myIndex);
      break;
  }
}

function birdFlap(index){
  birdRotation[index].set(-Math.PI/3);
  birdRotation[index].set(Math.PI/3, {duration : 500, curve: Easing.inExpo});
  birdParticle[index].setVelocity(birdParticleVelocityClick);
}

function startToGame(index){
  
  console.log(index);
  // Coses per tots els clients
  var disp = sinusDisp[index].get();
  sinus[index] = false;
  isMoving[index] = 1;
  sinusDisp[index].halt();
  sinusDisp[index].set(0);
  birdRotation[index].set(0);
  gravityId[index] = physicsEngine.attach(gravity,birdParticle[index]);
  birdRotation[index].set(-Math.PI/3);
  birdRotation[index].set(Math.PI/3, {duration : 500, curve: Easing.inExpo});
  birdParticle[index].setVelocity(birdParticleVelocityClick);
  
  // Coses quan és el propi client
  if (index == myIndex){
    setColPosition();
    numCol = 0;
    //console.log('>> game');
    phase = 'game';
    colAux = colQueue;
    //birdParticle.setPosition(birdParticleInitialPosition);
    gameController.show(gameView);
    //gameOn = true;
    // Callback
    callback();
    repeat = Timer.setInterval(callback,tick);  
  }  
}

// Rebre missatges
Streamy.on('welcome',function(data){
  maxPlayers = data.maxplayers;
  //console.log(maxPlayers);
  if ( data.index == -1 ){
    console.log('fu. no room 4 me');
  }
  else{
    //console.log(data.index);
    myIndex = data.index;
    birdAlive[myIndex] = true;
    birdImg[myIndex] = 1;
    //sinus[myIndex] = true;
    setup();    
  }
});

var pendingShows = [];

Streamy.on('showBird', function(data){
  //console.log('Showing bird ' + data.index);
  
  if ( birdShowModifier[data.index] === undefined || birdShowModifier[data.index] === null ){ 
    pendingShows.push(data.index);
  }
  else{
    birdShowModifier[data.index].show();  
    console.log(sinus);
  }
});
Streamy.on('hideBird', function(data){
  birdShowModifier[data.index].hide();
});

Streamy.on('gameAction', function(data){
  if (data.index != myIndex){
    console.log(data.index + ' just ' + data.action + '!'); 
    switch (data.action){
      case 'lost':
        birdLose(data.index);
        break;
      case 'started':
        startToGame(data.index);
        break;
      case 'flapped':
        birdFlap(data.index);
        break;
      case 'is ready':
        otherButtonOk(data.index, data.phase);
        break;
    }
  }
});

Streamy.on('KeyDown', function(data) {
  switch (data.data){
    case '1':
      console.log('1');
      break;
    default:
      console.log('unidentified KeyDown');
      break;
  }
});

function press1(){
  birdShowModifier[myIndex].hide();
}

function press2(){
  birdShowModifier[myIndex].show();
}

function stopCols(){
  for ( var i = 0; i < numCols; i++ ){
     //colTopSurfaceModifier[i].halt();
    colTopSurfaceModifier[i].setTransform(colTopSurfaceModifier[i].getTransform());
     //colBotSurfaceModifier[i].halt();
    colBotSurfaceModifier[i].setTransform(colBotSurfaceModifier[i].getTransform());
  }
}

function sortScores(a,b){return b.score - a.score;}

function birdLose(index){
  birdAlive[index] = 0;
  isMoving[index] = 0;
}

function Lose(){
  //console.log('>> lose');
  
  Streamy.emit('gameAction', {action: 'lost', id: Streamy.id, index: myIndex});
  Streamy.broadcast('gameAction', {action: 'lost', id: Streamy.id, index: myIndex});
  
  //birdAlive[myIndex] = 0;
  birdLose(myIndex);
  phase = 'lose';
  Timer.clear(repeat);
  stopCols();
  gameController.show(lostView);
  var id = Scores.insert({
    score: score,
    createdAt: new Date()
  });
  scoresArray = Scores.find().fetch();
  //console.log(scoresArray);
  scoresRanking = Scores.find().fetch().sort(sortScores);
  
  for ( var i = 0; i < scoresRanking.length; i++ ){
    if (scoresRanking[i]._id == id ){
      posicio = i;
    }
  }
}


function transIn (index){
  if (sinus[index]){
    sinusDisp[index].set(50, {duration : 700, curve: Easing.inOutQuad}, function(){transOut(index);});
  }
}

function transOut (index){
  console.log('transout ' + index);
  if (sinus[index]){
    sinusDisp[index].set(-50, {duration : 700, curve: Easing.inOutQuad }, function(){transIn(index);});
  }
}

function buttonScoreOk(){
  // Estem a scoreView i donem OK --> Anem a startView
}

function buttonScore(){
  // Hem apretat el botó 'Score' desde ( loseView OR startView )
  //console.log('Has fet ' + score + ' punts (top ' + posicio + ')!');
  //console.log(phase);
  
  scoreViewButton1.setContent('img/scoreHead11.jpg');
  scoreViewButton2.setContent('img/scoreHead20.jpg');
  scoreViewButton3.setContent('img/scoreHead30.jpg');
  
  gameController.show(scoreView);
  switch (phase){
    case 'lose':
      phase = 'loseScore';
      break;
    case 'start':
      phase = 'startScore';
      break;
  }
}


function collisionFunction(){
  if (birdAlive[myIndex]){
    if ( count == 15){
      count = 0;
      switch (birdImg[myIndex]){
        case 1:
          birdImg[myIndex] = 2;
          birdSurface[myIndex].setContent('img/birdie_2.png');
          break;
        case 2:
          birdImg[myIndex] = 3;
          birdSurface[myIndex].setContent('img/birdie_3.png');
          break;
        case 3:
          birdImg[myIndex] = 1;
          birdSurface[myIndex].setContent('img/birdie_1.png');
          break;
      }
    }
    count++;
  }
  
  if (phase == 'game'){
  
    if (birdParticle[myIndex].position.y > (960-heightFloor-birdParticleRadius)){
      Lose();
      birdParticle[myIndex].setVelocity([0,-0.5,0]);
    }
    
    for (var i = 0; i < numCols; i++ ){

      // Per cada set de columnes
      if ( ( (colTopSurfaceModifier[i].getTransform()[12]) < (birdParticleInitialPosition[0] + birdParticleRadius) ) && ( (colTopSurfaceModifier[i].getTransform()[12]) > (birdParticleInitialPosition[0] - birdParticleRadius - 113) ) ){

        // Bird i col[i] intersecten en X
        //console.log('>> Bird i col[' + i + '] intersect');
        if (aux[0] == i && aux[1] === 0){
          //console.log('>> aux=[' + i + ',1]');
          aux = [i,1];
        }
        
        // Mirem en Y
        if ( ((birdParticle[myIndex].position.y - birdParticleRadius) < colTopSurfaceModifier[i].getTransform()[13]) || ( (birdParticle[myIndex].position.y + birdParticleRadius) > colBotSurfaceModifier[i].getTransform()[13]) ){
          // You lose naab
          //console.log('xd noob');
          //console.log('>> lose');
          //phase = 'lose';
          erasethis++;
          Lose();
          birdParticle[myIndex].setVelocity([0,-0.5,0]);
        }
      }
      else{
        if ( aux[0] == i && aux[1] == 1 ){
          if ( i == (numCols-1)){
            aux = [0,0];
          }
          else{
            aux = [i+1,0];
          }
          score++;
          setScore(score);
          //console.log('____________________');
          //console.log('New point! Total: ' +score);
          //console.log('Expecting col[' + aux[0] + ']');
        }
      }
    }
  }
}

function callback(){
  
  if ( colAux.isEmpty() === false ){
    var randomVal = colAux.dequeue();
    var auxTop = randomVal - (spaceHeight/2);
    var auxBot = 960 - heightFloor - (randomVal+(spaceHeight/2));
    var w_mitja = 800 * w_space;

    colBotSurfaceModifier[numCol].setTransform(
      Transform.translate(640,randomVal+(spaceHeight/2),0),
      {duration: 0}    
    );  
    colTopSurfaceModifier[numCol].setTransform(
      Transform.translate(640,randomVal-(spaceHeight/2),0),
      {duration: 0}    
    );  
    colBotSurfaceModifier[numCol].setTransform(
      Transform.translate(-colWidth,randomVal+(spaceHeight/2),0),
      {duration: time}    
    );  
    colTopSurfaceModifier[numCol].setTransform(
      Transform.translate(-colWidth,randomVal-(spaceHeight/2),0),
      {duration: time}    
    );  

    numCol = numCol + 1;

    if ( numCol == numCols ) { numCol = 0; } 
  }
}

function setColPosition(){
  
  for ( var i = 0; i < numCols; i++ ){
    
    colTopSurfaceModifier[i].setTransform(
      Transform.translate(640,0,0),
      {duration: 0}
    );
    colBotSurfaceModifier[i].setTransform(
      Transform.translate(640,960-heightFloor,0),
      {duration: 0}
    );
  }
}

Meteor.startup(function(){
    gameController = new RenderController({
    inTransition: {curve: Easing.inOutQuart, duration: 0},
    outTransition: {curve: Easing.inOutQuart, duration: 0},
    overlap: true
  });
  
  gameControllerModifier = new Modifier({
    size: [640,960],
    align: [0.5,0],
    origin: [0.5,0],
    transform: function(){
      var scale = Math.min(window.innerWidth / 640,(window.innerHeight / 960)*1);
      return Transform.scale(scale,scale,1);
    }
  });
  
  mainContext = Engine.createContext();
  mainContext.add(gameControllerModifier).add(gameController);
  
  welcomeSurface = new Surface({
    content: 'hehe',
    properties:{
      backgroundColor: 'blue'
    }
  });
  welcomeView = new View();
  welcomeView.add(welcomeSurface);
  gameController.show(welcomeView);
  

});

// Main
function setup(){
  
  for (var i = 0; i < maxPlayers; i++){
    birdRotation[i] = new Transitionable(0);
    sinusDisp[i] = new Transitionable(0);   
    //sinus[i] = false;
  }
  
  //transOut();
  sinusDisp[myIndex].set(-50, {duration : 350, curve: Easing.outQuad}, function(){transIn(myIndex);});
  //console.log(( (960-heightFloor-spaceMin-(spaceHeight/2)) - (spaceMin+(spaceHeight/2)) ));
  // Col Queue
  colQueue = new Queue();
  for ( var i = 0; i < 1000; i++ ){
    
    colQueue.enqueue(Math.floor((Math.random()*( (960-heightFloor-spaceMin-(spaceHeight/2)) - (spaceMin+(spaceHeight/2)) )) + (spaceMin+(spaceHeight/2))));
  }
  
  // gameHeight
  gameHeight = 960;
  
  for ( var i = 0; i < numCols; i++ ){
    
    colTopSurface[i] = new ImageSurface({
      content: 'img/pipe_up.png',
      properties: {
        zIndex: 2
      }      
    });
    colBotSurface[i] = new ImageSurface({
      content: 'img/pipe.png',
      properties: {
        zIndex: 2
      }      
    });
    
    colTopSurfaceModifier[i] = new StateModifier({
       size: [113,500],
       origin: [0,1]
    });
    colBotSurfaceModifier[i] = new StateModifier({ 
      size: [113,500],
      origin: [0,0]
    });
    
  }
  
  setColPosition();
  
  startSurface = new Surface({
    size: [640,960],
    properties: {
      zIndex: 1
    }
  });
  
  gameBackgroundSurface = new ImageSurface({
    content: 'img/background5.png',
    size: [640,960],
    properties: {
      zIndex: 1
    }
  });
  
  backgroundTop = new Surface({
    properties: {
      backgroundColor: bgC,
      zIndex: 4
    }
  });
  
  backgroundBot = new Surface({
    properties: {
      backgroundColor: bgC,
      zIndex: 4
    }
  });
  
  backgroundLeft = new Surface({
    properties: {
      backgroundColor: bgC,
      zIndex: 4
    }
  });
  
  backgroundRight = new Surface({
    properties: {
      backgroundColor: bgC,
      zIndex: 4
    }
  });
  
  readySurface = new ImageSurface({
    content: 'img/ready.png'
  });
  
  readySurfaceModifier = new Modifier({
    size: [227,195],
    origin: [0.5,0.5],
    transform: function(){
      return Transform.translate(320,290,10)
    }
  });
  
  floorSurface = new ImageSurface({
    content: 'img/floor4.png',
    properties : {
      zIndex: 3
    }
  });
  
  floorSurfaceModifier = new Modifier({
    size: [640,heightFloor],
    transform: function(){
      return Transform.translate(0,960-heightFloor,0)
    }
  });
  
  // scoreView Surfaces and stuphph
  
  scoreViewButton1 =     new ImageSurface({
    content: 'img/scoreHead11.jpg'
  });
  scoreViewButton2 =     new ImageSurface({
    content: 'img/scoreHead20.jpg'
  });
  scoreViewButton3 =     new ImageSurface({
    content: 'img/scoreHead30.jpg'
  });
  scoreViewSurface =     new ImageSurface({
    content: 'img/scoreInfoBody.jpg'
  });
  scoreViewButtonOk =    new ImageSurface({
    content: 'img/btn_ok.png'
  });
  
  scoreViewButton1Modifier =     new StateModifier({
    size: [187,73],
    //transform:  Transform.translate(41,240,100)
    transform:  Transform.translate(41,168,100)
  });
  scoreViewButton2Modifier =     new StateModifier({
    size: [186,73],
    //transform:  Transform.translate(227,240,100)
    transform:  Transform.translate(227,168,100)
  });
  scoreViewButton3Modifier =     new StateModifier({
    size: [186,73],
    //transform:  Transform.translate(413,240,100)
    transform:  Transform.translate(413,168,100)
  });
  scoreViewSurfaceModifier =     new StateModifier({
    size: [558,407],
    //transform:  Transform.translate(41,313,100)
    transform:  Transform.translate(41,241,100)
  });
  scoreViewButtonOkModifier =    new StateModifier({
    size: [186,65],
    origin: [0.5,0],
    //transform:  Transform.translate(320,750,100)
    transform:  Transform.translate(320,678,100)
  });
  
  
  // !scoreView
  
  buttonOkSurface = new ImageSurface({
    content: 'img/btn_ok.png'
  });
  
  buttonOkSurfaceModifier = new StateModifier({
    size: [188,65],
    origin: [0.5,0.5],
    transform:  Transform.translate(320,640,100)
  });
  
  buttonScoreSurface = new ImageSurface({
    content: 'img/btn_score.png'
  });
  
  buttonScoreSurfaceModifier = new StateModifier({
    size: [188,65],
    origin: [0.5,0],
    transform:  Transform.translate(320,678,100)
  });
  
  scoreSurface[0] = new ImageSurface({
    content: 'img/zero.png'
  });
  
  scoreSurfaceModifier[0] = new StateModifier({
    size: [42,60],
    origin: [0.5,0.5],
    transform: Transform.translate(320,50,100)
  });
  
  scoreSurface[1] = new ImageSurface({
    content: 'img/zero.png'
  });
  
  scoreSurfaceModifier[1] = new StateModifier({
    opacity: 0,
    size: [42,60],
    origin: [0.5,0.5],
    transform: Transform.translate(341,50,100)
  });
  
  scoreSurface[2] = new ImageSurface({
    content: 'img/zero.png'
  });
  
  scoreSurfaceModifier[2] = new StateModifier({
    opacity: 0,
    size: [42,60],
    origin: [0.5,0.5],
    transform: Transform.translate(362,50,100)
  });
  
  backgroundTopModifier = new StateModifier({
    size: [undefined,undefined],
    origin: [0.5,1],
    align: [0.5,0]
  });
  backgroundBotModifier = new Modifier({
    size: [900,undefined],
    origin: [0,0],
    transform: function(){
      return Transform.translate(0,960,0);
    }
  });
  backgroundLeftModifier = new StateModifier({
    size: [undefined,1500],
    origin: [1,0]
  });
  backgroundRightModifier = new Modifier({
    size: [undefined,1500],
    origin: [0,0],
    transform: function(){
      return Transform.translate(640,0,0);
    }
  });
  
  clickSurface = new Surface({
    size: [undefined,undefined],
    properties:
    {
      zIndex: 20
    }
  });
  
  clickSurfaceModifier = new StateModifier({
    opacity: 0
  });
  
  // Physics
  physicsEngine = new PhysicsEngine();
  gravity = new Force(gravityForce);
  floorWall = new Wall({ normal: [0,-1,0], distance: (960-heightFloor)});
  
  for (var i = 0; i < maxPlayers; i++ ){
    birdParticle[i] = new Circle({
      mass: birdParticleMass,
      radius: birdParticleRadius,
      position: birdParticleInitialPosition,
      velocity: birdParticleInitialVelocity
    });  
    physicsEngine.addBody(birdParticle[i]);
    physicsEngine.attach(floorWall,birdParticle[i]);
  
  
    birdSurface[i] = new ImageSurface({
      content: 'img/birdie_1.png'
    });
  
    birdShowModifier[i] = new ShowModifier({visible: false});

/*    
    birdSurfaceModifier[i] = new Modifier({
      opacity: 1,
      transform: returnPlz(i)
    });  

    birdRotationSurfaceModifier[i] = new Modifier({
      size: [76,57],
      origin: [0.5,0.5],
        align: [0.5,0.5],
        transform: function(){
          return Transform.rotateZ(birdRotation[i].get());
        }
      }
    );

    birdPositionSurfaceModifier[i] = new Modifier({
      size: [76,57],
      origin: [0.5,0.5],
      transform: function(){
        return birdParticle[i].getTransform();
      }
    });
    */
  }
  
  /*
  
  function returnPlz(i){
    return Transform.translate(0,sinusDisp[i],0);
  }
  
  */
  
  function auxLoopFunction(i){
    birdSurfaceModifier[i] = new Modifier({
      opacity: 1,
      transform: function(){
        return Transform.translate(0,sinusDisp[i].get(),0);
      }
    });
    birdRotationSurfaceModifier[i] = new Modifier({
      size: [76,57],
      origin: [0.5,0.5],
      align: [0.5,0.5],
      transform: function(){
        return Transform.rotateZ(birdRotation[i].get());
      }
    });
    birdPositionSurfaceModifier[i] = new Modifier({
      size: [76,57],
      origin: [0.5,0.5],
      transform: function(){
        return birdParticle[i].getTransform();
      }
    });
  }
  
  // MEH
  
  for (var t = 0; t < maxPlayers; t++ ){
    auxLoopFunction(t);
  }
  /*
  birdSurfaceModifier[0] = new Modifier({
    opacity: 1,
    transform: function(){
      return Transform.translate(0,sinusDisp[0].get(),0);
    }
  });
  birdRotationSurfaceModifier[0] = new Modifier({
    size: [76,57],
    origin: [0.5,0.5],
    align: [0.5,0.5],
    transform: function(){
      return Transform.rotateZ(birdRotation[0].get());
    }
  });
  birdPositionSurfaceModifier[0] = new Modifier({
    size: [76,57],
    origin: [0.5,0.5],
    transform: function(){
      return birdParticle[0].getTransform();
    }
  });
  
  birdSurfaceModifier[1] = new Modifier({
    opacity: 1,
    transform: function(){
      return Transform.translate(0,sinusDisp[1].get(),0);
    }
  });

  birdRotationSurfaceModifier[1] = new Modifier({
    size: [76,57],
    origin: [0.5,0.5],
    align: [0.5,0.5],
    transform: function(){
      return Transform.rotateZ(birdRotation[1].get());
    }
  }
                                               );

  birdPositionSurfaceModifier[1] = new Modifier({
    size: [76,57],
    origin: [0.5,0.5],
    transform: function(){
      return birdParticle[1].getTransform();
    }
  });
  // END MEH
  */
  
  // gameView Setup
  gameView = new View();
  gameView.add(gameBackgroundSurface);
  gameView.add(floorSurfaceModifier).add(floorSurface);
  
  for (var i = 0; i < maxPlayers; i++ ){
    gameView.add(birdShowModifier[i]).add(birdPositionSurfaceModifier[i]).add(birdSurfaceModifier[i]).add(birdRotationSurfaceModifier[i]).add(birdSurface[i]);
  }
  
  for (var j = 0; j < numCols; j++){
    gameView.add(colTopSurfaceModifier[j]).add(colTopSurface[j]);
    gameView.add(colBotSurfaceModifier[j]).add(colBotSurface[j]);
  }
  //gameView.add(backgroundTopModifier).add(backgroundTop);
  gameView.add(scoreSurfaceModifier[0]).add(scoreSurface[0]);
  gameView.add(scoreSurfaceModifier[1]).add(scoreSurface[1]);
  gameView.add(scoreSurfaceModifier[2]).add(scoreSurface[2]);
  gameView.add(backgroundBotModifier).add(backgroundBot);
  gameView.add(backgroundRightModifier).add(backgroundRight);
  gameView.add(backgroundLeftModifier).add(backgroundLeft);
  //gameView.add(clickSurfaceModifier).add(clickSurface);
  
  // lostView setup
  lostView = new View();
  lostView.add(buttonOkSurfaceModifier).add(buttonOkSurface);
  lostView.add(buttonScoreSurfaceModifier).add(buttonScoreSurface);
  lostView.add(gameBackgroundSurface);
  lostView.add(scoreSurfaceModifier[0]).add(scoreSurface[0]);
  lostView.add(scoreSurfaceModifier[1]).add(scoreSurface[1]);
  lostView.add(scoreSurfaceModifier[2]).add(scoreSurface[2]);
  lostView.add(floorSurfaceModifier).add(floorSurface);
  
  for (var i = 0; i < maxPlayers; i++ ){
    lostView.add(birdShowModifier[i]).add(birdPositionSurfaceModifier[i]).add(birdSurfaceModifier[i]).add(birdRotationSurfaceModifier[i]).add(birdSurface[i]);
  }
  
  for (var j = 0; j < numCols; j++){
    lostView.add(colTopSurfaceModifier[j]).add(colTopSurface[j]);
    lostView.add(colBotSurfaceModifier[j]).add(colBotSurface[j]);
  }
  lostView.add(backgroundBotModifier).add(backgroundBot);
  lostView.add(backgroundRightModifier).add(backgroundRight);
  lostView.add(backgroundLeftModifier).add(backgroundLeft);
  
  // scoreView setup
  scoreView = new View();
  
  scoreView.add(scoreViewButton1Modifier).add(scoreViewButton1);
  scoreView.add(scoreViewButton2Modifier).add(scoreViewButton2);
  scoreView.add(scoreViewButton3Modifier).add(scoreViewButton3);
  scoreView.add(scoreViewSurfaceModifier).add(scoreViewSurface);
  scoreView.add(scoreViewButtonOkModifier).add(scoreViewButtonOk);  
  
  for (var j = 0; j < numCols; j++){
    scoreView.add(colTopSurfaceModifier[j]).add(colTopSurface[j]);
    scoreView.add(colBotSurfaceModifier[j]).add(colBotSurface[j]);
  }
  
  for (var i = 0; i < maxPlayers; i++ ){
    scoreView.add(birdShowModifier[i]).add(birdPositionSurfaceModifier[i]).add(birdSurfaceModifier[i]).add(birdRotationSurfaceModifier[i]).add(birdSurface[i]);
  }
  
  scoreView.add(gameBackgroundSurface);
  scoreView.add(floorSurfaceModifier).add(floorSurface);
  scoreView.add(backgroundBotModifier).add(backgroundBot);
  scoreView.add(backgroundRightModifier).add(backgroundRight);
  scoreView.add(backgroundLeftModifier).add(backgroundLeft);
  
  
  // startView setup
  startView = new View();
  
  //startView.add(scoreViewButton1Modifier).add(scoreViewButton1);
  //startView.add(scoreViewButton2Modifier).add(scoreViewButton2);
  //startView.add(scoreViewButton3Modifier).add(scoreViewButton3);
  //startView.add(scoreViewSurfaceModifier).add(scoreViewSurface);
  //startView.add(scoreViewButtonOkModifier).add(scoreViewButtonOk);
  
  //startView.add(buttonOkSurfaceModifier).add(buttonOkSurface);
  startView.add(buttonScoreSurfaceModifier).add(buttonScoreSurface);
  
  startView.add(readySurfaceModifier).add(readySurface);
  
  for (var i = 0; i < maxPlayers; i++ ){
    startView.add(birdShowModifier[i]).add(birdPositionSurfaceModifier[i]).add(birdSurfaceModifier[i]).add(birdRotationSurfaceModifier[i]).add(birdSurface[i]);
  }
  
  startView.add(birdShowModifier).add(birdPositionSurfaceModifier).add(birdSurfaceModifier).add(birdRotationSurfaceModifier).add(birdSurface);
  startView.add(gameBackgroundSurface);
  startView.add(floorSurfaceModifier).add(floorSurface);
  startView.add(backgroundBotModifier).add(backgroundBot);
  scoreView.add(backgroundRightModifier).add(backgroundRight);
  scoreView.add(backgroundLeftModifier).add(backgroundLeft);
  
  // mainContext setup
  
  // Pending shows...
  console.log(pendingShows.length);
  while (pendingShows.length !== 0){
    var k = pendingShows.pop();
    birdShowModifier[k].show();
    sinus[k] = true;
    birdAlive[k] = true;
    loopAux2(k);
  }
  
  function loopAux2(i){
    sinusDisp[i].set(-50, {duration : 350, curve: Easing.outQuad}, function(){transIn(i);});
  }
  
  // Start
  //console.log('>> start');
  phase = 'start';
  
  //Streamy.emit('gameAction', {action: 'is ready for the first time', id: Streamy.id});
  //Streamy.broadcast('gameAction', {action: 'is ready for the first time', id: Streamy.id});
  
  gameController.show(startView);
          
  
  // Callback
  //Timer.setInterval(callback,tick);
  
  // EVENTS
  scoreViewButton1.on('mousedown', function(){
    scoreViewButton1.setContent('img/scoreHead11.jpg');
    scoreViewButton2.setContent('img/scoreHead20.jpg');
    scoreViewButton3.setContent('img/scoreHead30.jpg');
  });
  scoreViewButton2.on('mousedown', function(){
    scoreViewButton1.setContent('img/scoreHead10.jpg');
    scoreViewButton2.setContent('img/scoreHead21.jpg');
    scoreViewButton3.setContent('img/scoreHead30.jpg');
  });
  scoreViewButton3.on('mousedown', function(){
    scoreViewButton1.setContent('img/scoreHead10.jpg');
    scoreViewButton2.setContent('img/scoreHead20.jpg');
    scoreViewButton3.setContent('img/scoreHead31.jpg');
  });
  
  scoreViewButtonOk.on('mousedown',function(){
    buttonOk(myIndex);
  });
  
  buttonOkSurface.on('mousedown', function(){
    buttonOk(myIndex);
  });
  buttonScoreSurface.on('mousedown', function(){
    buttonScore();
  });
  
  // mouseClick
  Engine.on('mousedown', function(){
    action();
  });
  
  Engine.on('postrender',function(){    
    // Mirar colision
    collisionFunction();
  });
  
  Engine.on('keydown', function(e){
    switch (e.which){
      case 49:
        // Emit
        press1();
        break;
      case 50:
        press2();
        break;
      case 51:
        Streamy.emit('KeyDown', { data: '3' });
        break;
      case 52:
        Streamy.emit('KeyDown', { data: '4' });
        break;
      case 53:
        Streamy.emit('KeyDown', { data: '5' });
        break;
      case 54:
        Streamy.emit('KeyDown', { data: '6' });
        break;
      case 55:
        Streamy.emit('KeyDown', { data: '7' });
        break;
      case 56:
        Streamy.emit('KeyDown', { data: '8' });
        break;
      case 32:
        action();
        break;
      case 38:
        action();
        break;
    }
  });
  
}

function returnPlz(i){
  return Transform.translate(0,sinusDisp[i],0);
}

/* Creates a new queue. A queue is a first-in-first-out (FIFO) data structure -
 * items are added to the end of the queue and removed from the front.
 */
function Queue(){

  // initialise the queue and offset
  var queue  = [];
  var offset = 0;

  // Returns the length of the queue.
  this.getLength = function(){
    return (queue.length - offset);
  }

  // Returns true if the queue is empty, and false otherwise.
  this.isEmpty = function(){
    return (queue.length == 0);
  }

  /* Enqueues the specified item. The parameter is:
   *
   * item - the item to enqueue
   */
  this.enqueue = function(item){
    queue.push(item);
  }

  /* Dequeues an item and returns it. If the queue is empty, the value
   * 'undefined' is returned.
   */
  this.dequeue = function(){

    // if the queue is empty, return immediately
    if (queue.length == 0) return undefined;

    // store the item at the front of the queue
    var item = queue[offset];

    // increment the offset and remove the free space if necessary
    if (++ offset * 2 >= queue.length){
      queue  = queue.slice(offset);
      offset = 0;
    }

    // return the dequeued item
    return item;

  }

  /* Returns the item at the front of the queue (without dequeuing it). If the
   * queue is empty then undefined is returned.
   */
  this.peek = function(){
    return (queue.length > 0 ? queue[offset] : undefined);
  }

}

var Transform = require('famous/core/Transform');
 
function ShowModifier(options) {
  this.visible = !!options.visible;
  this._output = {
    transform: Transform.identity,
    opacity: 1,
    origin: null,
    align: null,
    size: null,
    target: null
  };
}
 
ShowModifier.prototype.modify = function(target){
  this._output.target = this.visible? target: null;
  return this._output;
};
 
ShowModifier.prototype.show = function show(){
  this.visible = true;
};
 
ShowModifier.prototype.hide = function hide() {
  this.visible = false;
};