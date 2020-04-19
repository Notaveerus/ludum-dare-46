var Player = function (sPoint){
  this.x = sPoint.x;
  this.y = sPoint.y;
  this.size = 32;
  this.rotation = 0;
  this.speed = 0.5;
  this. corners = [new V(this.x,this.y),new V(this.size+this.x,this.y),new V(this.size+this.x,this.size+this.y),new V(this.x,this.size+this.y)];
  this.hitBox = new P(new V(0,0),this.corners);
  this.camera = new Camera(0,0,canvas_width,canvas_height,gameWidth,gameHeight);
  this.camera.follow({x:this.x+this.size/2,y:this.y+this.size/2},canvas_width/2,canvas_height/2);
  this.mousePos = {
    x:0,
    y:0
  }
  this.chopBox;
  this.swingSpeed = 30;
  this.swingCooldown = this.swingSpeed;

  this.wood = 0;
  this.midpoint = function(){
    return {
      x:this.x+(this.size/2),
      y:this.y+(this.size/2)
    }
  }
  this.update = function(td){
    this.handleKeys(td);
    this.camera.update(this.midpoint());
    this.corners = [new V(this.x,this.y),new V(this.size+this.x,this.y),new V(this.size+this.x,this.size+this.y),new V(this.x,this.size+this.y)];
    this.hitBox = new P(new V(0,0),this.corners);
    this.mousePos.x = inputData.mouse.x+this.camera.xView;
    this.mousePos.y = inputData.mouse.y+this.camera.yView;
    this.corners = this.lookAtMouse(this.midpoint(),this.corners);
    this.x = this.x.clamp(0,gameWidth-this.size);
    this.y = this.y.clamp(0,gameHeight-this.size);
    this.collide();
  }
  this.handleKeys = function(td){
    var direction = new V(0,0);
    if(inputData.left){
      direction.x -=1;
    }
    if(inputData.right){
      direction.x +=1;
    }
    if(inputData.up){
      direction.y -=1;
    }
    if(inputData.down){
      direction.y +=1;
    }
    if(inputData.lmb){
      this.getChop();
    }
    if(inputData.lmb && this.swingCooldown == 0){
      this.chop();
      this.swingCooldown = this.swingSpeed;
    } else if (this.swingCooldown>0){
      this.swingCooldown--;
    }

    direction.normalize();
    this.x += direction.x * this.speed*td;
    this.y += direction.y * this.speed*td;
  }
  this.lookAtMouse = function(midpoint, corners){
    this.rotation = Math.atan2(this.mousePos.x-midpoint.x,this.mousePos.y-midpoint.y)*180/Math.PI;
    var angle = -this.rotation * (Math.PI/180);
    if(angle){
      for(var i=0;i<corners.length;i++){

        //Get coordinates relative to midpoint
        var xr = corners[i].x - midpoint.x;
        var yr = corners[i].y - midpoint.y;
        //Rotate points by angle
        var xn = (xr * Math.cos(angle))-(yr *Math.sin(angle));
        var yn = (xr * Math.sin(angle))+(yr *Math.cos(angle));
        //Shift coordinates back
        var xf = xn + midpoint.x;
        var yf = yn + midpoint.y;
        //Set corners
        corners[i].x = xf;
        corners[i].y = yf;
      }
      return corners;
    }
  }
  this.getChop = function(){
    var angle = Utils.getRotation(this.midpoint(),this.mousePos);
    var vector = new V(0,32);
    vector.rotate(angle*Math.PI/180);
    var newMid = {
      x: this.midpoint().x+vector.x,
      y: this.midpoint().y+vector.y
    }
    this.chopBox = new P(new V(),[this.corners[0].add(vector),this.corners[1].add(vector),this.corners[2].add(vector),this.corners[3].add(vector)]);
  }
  this.chop = function(){
    var response = new SAT.Response();
    for(var i=0;i<trees.length;i++){
      var tree = trees[i];
      if(!tree.dur>0)continue;
      var collide = SAT.testPolygonCircle(this.chopBox,tree.hitBox,response);
      if(collide) {
        trees[i].dur--;
        if(tree.dur<=0){
          this.wood += tree.getWood();

          trees.splice(i,1);
        }
        this.chopBox = undefined;
        break;
      }
      response.clear();
    }

  }
  this.collide = function(){
    var response = new SAT.Response();
    var collided = SAT.testPolygonPolygon(this.hitBox,train.hitBox,response)
    if(collided){
      var overlap = response.overlapV;
      this.x-=overlap.x;
      this.y-=overlap.y;
      if(player.wood>0){
        train.fuel+=player.wood;
        player.wood = 0;
      }
    }
    for(var i=0;i<train.carriages.length;i++){
      response.clear();
      var car = train.carriages[i];
      collided = SAT.testPolygonPolygon(this.hitBox,car.hitBox,response)
      if(collided){
        this.x -= response.overlapV.x;
        this.y -= response.overlapV.y;
      }
    }
  }
  this.draw = function(){
    ctx.fillStyle = 'red';
    if(this.corners){
      ctx.beginPath();
      ctx.moveTo(this.corners[0].x-this.camera.xView,this.corners[0].y-this.camera.yView);
      for(var i=1;i<this.corners.length;i++){
        var intersect = this.corners[i];
        ctx.lineTo(intersect.x-this.camera.xView,intersect.y-this.camera.yView);
      }
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = 'blue';
    }


  }
}

var Axe = function(x,y){
  this.x = x;
  this.y = y;

}
