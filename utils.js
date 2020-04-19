var Utils = {
   degree: function(pos2, pos1, inRad) {
    var dy = pos2.x - pos1.x;
    var dx = pos2.y - pos1.y;
    var theta = Math.atan2(dy,dx);
    return theta *= inRad ? 1 : (180/Math.PI);
  },
  getRotation: function(playerPos,mousePos){
    var pos1 = {
      x: mousePos.x,
      y: mousePos.y
    }
      return -Utils.degree(pos1, playerPos,false);
    },
    sortArray: function(a,b){
      if(a.health/a.maxHealth>b.health/b.maxHealth){
        return 1
      if(a.health/a.maxHealth<b.health/b.maxHealth)
        return -1
      return 0;
      }
    },
        moveTo: function(obj,speed){
      var tmpDir = Engine.degree({x:obj.targetPos.x,y:obj.targetPos.y}, {x:obj.x+obj.w/2,y:obj.y+obj.w/2},true);
      var tmpX = Math.cos(tmpDir-Math.PI/2)
      var tmpY = Math.sin(tmpDir+Math.PI/2)
      obj.x += tmpX*speed;
      obj.y += tmpY*speed;

    },
    collide: function(obj, hitData){
          obj.health-=hitData[0].obj.damage;
          obj.healthBar.subtract(hitData[0].obj.damage,obj.maxHealth);
        hitData[0].obj.destroy();

        if(obj.health<0||obj.health==0){
          this.death(obj);
        }
    },
    between: function(x,min,max){
      return x >= min && x <= max;
    }

}

Number.prototype.clamp = function(min,max) {
  return Math.min(Math.max(this,min),max);
}
