class Pipe {
  constructor() {

    // How big is the empty space
    let spacing = 150;
    // Where is th center of the empty space
    let centery = random(spacing, height - spacing);

    //load the North and South pipes 
    this.pipeN = new Image(); 
    this.pipeS = new Image(); 

    this.pipeN.src = "img/pipetop.png"; 
    this.pipeS.src = "img/pipebottom.png"; 

    // Top and bottom of pipe
    this.top = centery - spacing / 2;
    this.bottom = height - (centery + spacing / 2);
    // Starts at the edge
    this.x = width;
    // Width of pipe
    this.w = 80;
    // How fast
    this.speed = 6;
  }

  // Did this pipe hit a bird?
  hits(bird) {
    if ((bird.y - bird.r) < this.top || (bird.y + bird.r) > (height - this.bottom)) {
      if (bird.x > this.x && bird.x < this.x + this.w) {
        return true;
      }
    }
    return false;
  }

  // Draw the pipe
  show() {
    ctx.drawImage(this.pipeN, this.x, 0, this.w, this.top); 
    ctx.drawImage(this.pipeS, this.x, height - this.bottom, this.w, this.bottom); 
  }

  // Update the pipe
  update() {
    this.x -= this.speed;
  }

  // Has it moved offscreen?
  offscreen() {
    if (this.x < -this.w) {
      return true;
    } else {
      return false;
    }
  }
}