function DrawingRect( _imgs, _x, _y, _w, _h) {

  this.x=_x;
  this.y=_y;
  this.w=_w;
  this.h=_h;
  this.timeToNext = 100;
  this.imgs = [_imgs.length];

  this.imgs = _imgs;
  this.curTime = millis();
  this.index = 0;
  this.which =  int(random(this.imgs.length/2));
  this.cur = this.imgs[this.which * 2 + this.index];

  this.display = function() {

    image(this.cur, this.x, this.y, this.w, this.h);
    if (millis() >= (this.curTime+this.timeToNext)) {
      this.setNext();
      this.curTime = millis();
    }
  }

  this.divide = function() {
    var resultRects = [4];
    resultRects[0] = new DrawingRect(this.imgs, this.x, this.y, this.w/2, this.h/2);
    resultRects[1] = new DrawingRect(this.imgs, this.x+this.w/2, this.y, this.w/2, this.h/2);
    resultRects[2] = new DrawingRect(this.imgs, this.x, this.y+this.h/2, this.w/2, this.h/2);
    resultRects[3] = new DrawingRect(this.imgs, this.x+this.w/2, this.y+this.h/2, this.w/2, this.h/2);
    return resultRects;
  }

  this.setNext  = function() {
    if (this.index < 1) this.index++;
    else this.index = 0;
    if (!this.still) {
      this.which = int(random(this.imgs.length/2));
      this.cur = this.imgs[this.which * 2 + this.index];
    } else {
      this.cur = this.imgs[this.which * 2 + this.index];
    }
  }

  this.setStill = function(tf) {
    this.still=tf;
  }

  this.getStill = function() {
    return this.still;
  }
}
