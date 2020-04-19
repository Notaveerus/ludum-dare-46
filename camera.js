function Rectangle(left,top,width,height){
  this.left = left || 0;
		this.top = top || 0;
    this.width = width || 0;
		this.height = height || 0;
		this.right = this.left + this.width;
		this.bottom = this.top + this.height;

		this.set = function(left, top, /*optional*/width, /*optional*/height){
			this.left = left;
      this.top = top;
      this.width = width || this.width;
      this.height = height || this.height
      this.right = (this.left + this.width);
      this.bottom = (this.top + this.height);
		}

		this.within = function(r) {
			return (r.left <= this.left &&
					r.right >= this.right &&
					r.top <= this.top &&
					r.bottom >= this.bottom);
		}

	this.overlaps = function(r) {
			return (this.left < r.right &&
					r.left < this.right &&
					this.top < r.bottom &&
					r.top < this.bottom);
		}
}
var Camera = function(xView,yView,canvasWidth,canvasHeight,worldWidth,worldHeight){
  this.xView = xView || 0;
  this.yView = yView || 0;
  //Distance from followed object to border before camera starts to move
  this.xDeadZone = 0;
  this.yDeadZone = 0;
  //Viewport Dimensions
  this.wView = canvasWidth;
  this.hView = canvasHeight;
  //Object to be followed
  this.followed = null;
  //Rectangle that represents the Viewport
  this.viewPortRect = new Rectangle(this.xView,this.yView,this.wView,this.hView);
  //Rectangle that represents world boundary
  this.worldRect = new Rectangle(0,0,worldWidth,worldHeight);

  this.follow = function(gameObj, xDeadZone,yDeadZone){
    this.followed = gameObj;
    this.xDeadZone = xDeadZone;
    this.yDeadZone = yDeadZone;
  };

  this.update = function(follow){
    if(follow != null){
      if(follow.x-this.xView + this.xDeadZone >this.wView)
        this.xView = follow.x - (this.wView - this.xDeadZone);
      else if(follow.x - this.xDeadZone <this.xView)
        this.xView = follow.x-this.xDeadZone;

      if(follow.y - this.yView + this.yDeadZone > this.hView)
			   this.yView = follow.y - (this.hView - this.yDeadZone);
			else if(follow.y - this.yDeadZone < this.yView)
			   this.yView = follow.y - this.yDeadZone;
    };
    this.viewPortRect.set(this.xView,this.yView);

    if(!this.viewPortRect.within(this.worldRect)){
      if(this.viewPortRect.left < this.worldRect.left)
				this.xView = this.worldRect.left;
			if(this.viewPortRect.top < this.worldRect.top)
				this.yView = this.worldRect.top;
			if(this.viewPortRect.right > this.worldRect.right)
				this.xView = this.worldRect.right - this.wView;
			if(this.viewPortRect.bottom > this.worldRect.bottom)
				this.yView = this.worldRect.bottom - this.hView;
    }
  }
};
