var Train = function(x,y,colour,carriage){
  //
  this.x= x;
  this.y= y;
  this.speed= 0.15;
  this.size = 50;
  this.offset = 10;
  this.trackSize=50;
  this.carriage = carriage;
  this.carriages = [];
  this.colour = colour;
  this.tracks= {0:new Track(this.x,this.y,this.trackSize,0)};
  this.tracksIndex = {0:0};
  this.hitBox = new B(new V(this.x,this.y),this.size,this.size).toPolygon();
  this.currentTrack = 0;
  this.rotation= 0;

  this.stop = false;
  this.fuel = 100;
  this.speedMod = 0.005;
  this.midpoint = function(){
    return {
      x:this.x+(this.size/2),
      y:this.y+(this.size/2)
    }
  }
  this.generateTrack= function(){
    var end = false;
    var currPos = {x:this.x,y:this.y};
    var dir = 0;
    var prevDir;
    var prevPos;
    var turnProb = 0.025;
    var track;
    var lastTrack;
    while(currPos.x<gameWidth-this.trackSize){
      var rand = Math.random();
      if(rand < turnProb/2){
        prevDir = dir;
        dir += 1;
        turnProb = 0.025
      } else if(rand <turnProb){
        prevDir = dir;
        dir += -1;
        turnProb = 0.025
      } else{
        turnProb+=0.005

      }
      if(dir<0) dir = 2;
      if(dir>2) dir = 0;
      prevPos = currPos;
      currPos = this.getNeighbouringCell(dir,currPos.x,currPos.y);
      currPos.x = currPos.x.clamp(0,gameWidth-this.trackSize);
      currPos.y = currPos.y.clamp(0,gameHeight-this.trackSize);
      if(this.tracks[currPos.y*(gameWidth/this.trackSize)+(currPos.x/this.trackSize)]){
        currPos = prevPos;
        dir +=1;
        continue;
      }
      track = new Track(currPos.x,currPos.y,this.trackSize,dir,Object.keys(this.tracksIndex).length)

      this.tracks[currPos.y*(gameWidth/this.trackSize)+(currPos.x/this.trackSize)] = track;
      this.tracksIndex[Object.keys(this.tracksIndex).length] = currPos.y*(gameWidth/this.trackSize)+(currPos.x/this.trackSize);

    }
  };
  this.getNeighbouringCell= function(dir,x,y){
    var cells = [];
    var mod = this.trackSize;
    var neighbours = [{x:mod,y:0},{x:0,y:mod},{x:0,y:-mod}]
    var near = neighbours[dir];
    var cell = {x:x+near.x,y:y+near.y}
    return cell;
  };
  this.drive = function(td){
    var nextTrackIndex = this.tracksIndex[this.currentTrack+1];
    var currTrack = this.tracks[this.tracksIndex[this.currentTrack]];
    var nextTrack = this.tracks[nextTrackIndex];

    var direction = new V(0,0);
    direction.x = nextTrack.x-this.x;
    direction.y = nextTrack.y-this.y;
    direction.normalize();

    this.x += direction.x*(this.speed+this.speedMod)*td;
    this.y += direction.y*(this.speed+this.speedMod)*td;
    if(Math.abs(this.x-nextTrack.x)<this.speed*td*1.1 && Math.abs(this.y-nextTrack.y)<this.speed*td*1.1){
      this.currentTrack++;
      this.fuel-= 1+this.speedMod;
      //this.speedMod += Math.round(Math.random()) ? 0.005:0;

      var newPos;
      if(this.carriages.length>0){
        newPos = {x:this.carriages[this.carriages.length-1].x-this.size-this.offset,y:this.carriages[this.carriages.length-1].y}
      } else{
        newPos = {x:this.tracks[0].x-this.offset,y:this.tracks[0].y}
      }
      this.carriages.push(new Car(newPos.x,newPos.y))
    }
    if(this.tracksIndex[this.currentTrack+1] == undefined){
      this.stop = true;
      score += train.currentTrack
    }

  };
  this.update = function(td){
    if(this.fuel <=0 )this.stop = true;
    if(!this.stop){
      this.drive(td);
      this.hitBox = new B(new V(this.x,this.y),this.size,this.size).toPolygon();
      this.collide();
    }
    for(var c=0;c<this.carriages.length;c++){
      var car = this.carriages[c];
      car.update(td)
    }
  }
  this.collide = function(){
    var response = new SAT.Response();
    if(!this.carriage){
      for(var i=0;i<trees.length;i++){
        let tree = trees[i];
        var collided = SAT.testPolygonCircle(this.hitBox,tree.hitBox,response)

        if(collided){
          this.stop = true;          
        }
        response.clear();
      }
    }

  }
  this.draw= function(){
    ctx.beginPath();
    ctx.lineJoin = "round";
    ctx.strokeStyle = "pink";
    ctx.lineWidth = 10;

    for(let key in this.tracksIndex){
      this.tracks[this.tracksIndex[key]].draw();
    }
    ctx.stroke();
    ctx.fillStyle = this.colour;
    ctx.strokeStyle = "gray";
    ctx.lineWidth = 25;
    if(this.carriages.length>0){
      let c1 = this.carriages[0].midpoint()
      ctx.beginPath();
      ctx.moveTo(this.midpoint().x-player.camera.xView,this.midpoint().y-player.camera.yView);
      ctx.lineTo(c1.x-player.camera.xView,c1.y-player.camera.yView)
      ctx.stroke();
    }
    ctx.fillRect(this.x-player.camera.xView,this.y-player.camera.yView,this.trackSize,this.trackSize);

    for(let c=0;c<this.carriages.length;c++){
      var car = this.carriages[c];
      if(this.carriages[c+1]){
        let mid = car.midpoint();
        let nextMid = this.carriages[c+1].midpoint();
        ctx.beginPath();
        ctx.moveTo(mid.x-player.camera.xView,mid.y-player.camera.yView);
        ctx.lineTo(nextMid.x-player.camera.xView,nextMid.y-player.camera.yView)
        ctx.stroke();
      }
      car.draw();
    }
  }
}
var Track = function(x,y,size,direction,index){
  this.x = x;
  this.y = y;
  this.size = size;
  this.dir = direction; //0=right, 1=up,2=down
  this.index = index;
  this.prevTrack;
  this.nextTrack;
  this.getDir = function(){
    var prevIndex = this.index-1;
    var nextIndex = this.index+1;
    var prev = train.tracks[train.tracksIndex[prevIndex]]
    var next = train.tracks[train.tracksIndex[nextIndex]]
    this.prevTrack = prev.dir;
    this.nextTrack = next.dir;
  }
  this.draw = function(){
    var viewP = player.camera
    ctx.strokeStyle = "brown";
    ctx.strokeRect(this.x-viewP.xView,this.y-viewP.yView,this.size,this.size);
    // switch(this.dir){
    //   case 0:
    //     ctx.moveTo(this.x-viewP.xView,this.y-viewP.yView);
    //     ctx.lineTo(this.x+this.size-viewP.xView,this.y-viewP.yView);
    //     ctx.moveTo(this.x-viewP.xView,this.y+this.size-viewP.yView);
    //     ctx.lineTo(this.x+this.size-viewP.xView,this.y+this.size-viewP.yView);
    //     break;
    //   case 1:
    //     if(this.prevTrack == this.dir){
    //       ctx.moveTo(this.x-viewP.xView,this.y+this.size-viewP.yView)
    //       ctx.lineTo(this.x-viewP.xView,this.y-viewP.yView);
    //       ctx.moveTo(this.x+this.size-viewP.xView,this.y+this.size-viewP.yView)
    //       ctx.lineTo(this.x+this.size-viewP.xView,this.y-viewP.yView)
    //     } else{
    //       ctx.moveTo(this.x-viewP.xView,this.y+this.size-viewP.yView)
    //       ctx.lineTo(this.x+this.size-viewP.xView,this.y+this.size-viewP.yView)
    //       ctx.lineTo(this.x+this.size-viewP.xView,this.y-viewP.yView)
    //     }
    // }


  }
}

var Car = function(x,y){
  this.x = x;
  this.y = y;
  this.colour = 'orange';
  this.speed = train.speed;
  this.currentTrack = 0;
  this.size = train.size;
  this.hitBox = new B(new V(this.x,this.y),this.size,this.size).toPolygon();
  this.midpoint = function(){
    return {
      x:this.x+(this.size/2),
      y:this.y+(this.size/2)
    }
  }
  this.update = function(td,prev){
    if(!train.stop){
      var nextTrackIndex = train.tracksIndex[this.currentTrack+1];
      var currTrack = train.tracks[train.tracksIndex[this.currentTrack]];
      var nextTrack = train.tracks[nextTrackIndex];

      var direction = new V(0,0);
      direction.x = nextTrack.x-this.x;
      direction.y = nextTrack.y-this.y;
      direction.normalize();

      this.x += direction.x*(this.speed+train.speedMod)*td;
      this.y += direction.y*(this.speed+train.speedMod)*td;
      if(Math.abs(this.x-nextTrack.x)<this.speed*td*1.1 && Math.abs(this.y-nextTrack.y)<this.speed*td*1.1){
        this.currentTrack++;
      }
      this.hitBox = new B(new V(this.x,this.y),this.size,this.size).toPolygon();
    }

  }
  this.draw = function(){
    ctx.fillStyle = this.colour;
    ctx.fillRect(this.x-player.camera.xView,this.y-player.camera.yView,train.size,train.size)
  }

}
