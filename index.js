
  var canvas_width = window.innerWidth;
  var canvas_height = window.innerHeight;
  var gameWidth = 10000;
  var gameHeight = 10000;
  var V = SAT.Vector;
  var P = SAT.Polygon;
  var B = SAT.Box;
  var C = SAT.Circle;
  var inputData = {
    mouse: {x:0, y:0},
    lmb: false,
    rmb: false,
    selected:null,
    up: false,
    down: false,
    left: false,
    right: false
  }

  var gameCanvas = document.getElementById('game');
  gameCanvas.width = canvas_width;
  gameCanvas.height = canvas_height;

  var ctx = gameCanvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  var active = true;
  var reset = function(value){
    player = null;
    train.carriages = null;
    train = null;
    trees = [];
    inputData = {
      mouse: {x:0, y:0},
      lmb: false,
      rmb: false,
      selected:null,
      up: false,
      down: false,
      left: false,
      right: false
    }
    lastUpdateTime = (new Date()).getTime();
    init();
  }

  var player;
  var train;
  var trees = [];
  var score = 0;
  var init = function(){
    player = new Player({x:canvas_width/2,y:gameHeight/2});
    train = new Train(5,gameHeight/2,'blue',false);
    active = true;
    train.generateTrack();
    randomTree(train.trackSize);
  }
  init();

  var lastUpdateTime = (new Date()).getTime();
  setInterval(function(){
    ctx.clearRect(0,0,canvas_width,canvas_height);
    if(active){
      var td = new Date().getTime()-lastUpdateTime;
      player.update(td);
      train.update(td);
      train.draw();
      player.draw();
      lastUpdateTime =  (new Date()).getTime();
      if(train.stop) active = false;
    }
    for(var i=0;i<trees.length;i++){
      if(trees[i].dur>0){
        var dx = player.x - trees[i].x;
        var dy = player.y - trees[i].y;
        var dist = Math.sqrt((dx*dx)+(dy*dy))

        if(dist<=canvas_width) trees[i].draw();
      }
    }
    ctx.font = "30px Tahoma";
    ctx.fillStyle = "White";
    ctx.strokeStyle = "black"
    ctx.lineWidth = 8;
    ctx.textAlign = "start";
    ctx.strokeText("Distance Travelled: "+train.currentTrack+score*5,30,50);
    ctx.fillText("Distance Travelled: "+train.currentTrack+score*5,30,50);

    ctx.font = "30px Tahoma";
    if(train.fuel>75) ctx.fillStyle = "green";
    else if(train.fuel>25) ctx.fillStyle = "yellow";
    else ctx.fillStyle = "red";
    ctx.strokeStyle = "black"
    ctx.lineWidth = 8;
    ctx.textAlign = "right";
    ctx.strokeText("Fuel Remaining: "+Math.floor(train.fuel),canvas_width-30,50);
    ctx.fillText("Fuel Remaining: "+Math.floor(train.fuel),canvas_width-30,50);

    ctx.font = "30px Tahoma";
    if(train.fuel>75) ctx.fillStyle = "green";
    else if(train.fuel>25) ctx.fillStyle = "yellow";
    else ctx.fillStyle = "red";
    ctx.strokeStyle = "black"
    ctx.lineWidth = 8;
    ctx.textAlign = "center";
    ctx.strokeText("Current Wood: "+player.wood,canvas_width/2,canvas_height-30);
    ctx.fillText("Current Wood: "+player.wood,canvas_width/2,canvas_height-30);

    if(!active){
      if(train.fuel<=0) var text = "Train ran out of fuel"
      else{ var text = "Train Derailed"}
      ctx.font = "40px Tahoma";
      ctx.fillStyle = "White";
      ctx.strokeStyle = "black"
      ctx.lineWidth = 8;
      ctx.textAlign = "center";
      ctx.strokeText(text,canvas_width/2,canvas_height/2);
      ctx.fillText(text ,canvas_width/2,canvas_height/2);
      ctx.strokeText("Press \"Space\" to try again",canvas_width/2,canvas_height/2+45);
      ctx.fillText("Press \"Space\" to try again",canvas_width/2,canvas_height/2+45);
      score = 0;

    }

  },1000/60)
