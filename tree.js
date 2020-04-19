var randomTree = function(cellSize){
  noise.seed(Math.random());
  var treeList = [];
  for(var y=0;y<gameHeight/cellSize;y++){
    for(var x=0;x<gameWidth/cellSize;x++){
      let cellX = x*cellSize;
      let cellY = y*cellSize;
      var noiseFunc = noise.simplex2(cellX/cellSize,cellY/cellSize)
      if(noiseFunc>0.85){
        var tree = new Tree(cellX,cellY,cellSize);
        var offset = 500;
        if(cellX < offset && (cellY < (gameHeight/2-offset)&&cellY > (gameHeight/2+offset))){
          trees.push(tree)
        } else if(cellX>offset){
          trees.push(tree);
        }
      }
    }
  }
}

var Tree = function(x,y,size){
  this.x = x;
  this.y = y;
  this.size = Math.floor(size*(Math.random()*(1.2-0.8)+0.8));
  this.baseWood = 0.1;
  this.hitBox = new C(new V(this.x,this.y),this.size);
  this.dur = 2;
  this.getWood = function(){    
    return Math.floor(this.baseWood*this.size);
  }
  this.draw = function(){
    ctx.strokeStyle = 'green';
    if(this.dur<2) ctx.strokeStyle = 'red';
    ctx.fillStyle = '#27DC27'
    ctx.beginPath();
    ctx.arc(this.hitBox.pos.x-player.camera.xView,this.hitBox.pos.y-player.camera.yView,this.hitBox.r,0,2*Math.PI)
    ctx.stroke();
    ctx.fill();
  }
}
