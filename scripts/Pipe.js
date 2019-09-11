class Pipe {
  constructor() {

    const clearing = 150 // How big is the empty space
    let clearing_midpoint = random(clearing, 512 - clearing) // 512 is the height of the canvas, this should be dynamic

    this.top_img = new Image() // Creates HTML image
    this.top_img.src = "img/pipetop.png"

    this.bottom_img = new Image()
    this.bottom_img.src = "img/pipebottom.png"

    // Top and bottom of pipe
    this.top = clearing_midpoint - clearing / 2
    this.bottom = 512 - (clearing_midpoint + clearing / 2)

    this.x = 450 // starts at the right edge of the screen
    this.width = 80 // width of pipe
    // How fast
    this.speed = 6;
  }

  // Did this pipe hit a bird?
  hits(bird) {
    if ((bird.y - bird.r) < this.top || (bird.y + bird.r) > (512 - this.bottom)) {
      if (bird.x > this.x && bird.x < this.x + this.width) {
        return true;
      }
    }
    return false;
  }

  // Draw the pipe
  show() {
    ctx.drawImage(this.top_img, this.x, 0, this.width, this.top); // Depends on ctx, which is declared outside this scope
    ctx.drawImage(this.bottom_img, this.x, 512 - this.bottom, this.width, this.bottom);
  }

  // Update the pipe
  reposition() {
    this.x -= this.speed;
  }

  // Has it moved offscreen?
  isVisible() {
    return (this.x > -this.width)
  }
}
