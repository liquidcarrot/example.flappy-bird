let Bird = function(brain) {
  // position and size of bird
  this.x = 64;
  this.y = height / 2;
  this.r = 12;
  this.brain = brain;
  this.birdImage = new Image();
  this.birdImage.src = "img/bird.png";
  // Gravity, lift and velocity
  this.gravity = 0.8;
  this.lift = -12;
  this.velocity = 0;
  // Score is how many frames it's been alive
  this.score = 0;
  // Fitness is normalized version of score
  this.fitness = 0;
  
  // Create a copy of this bird
  this.copys = function(){
    return new Bird(this.brain);
  }

  this.draw = function(){
      ctx.drawImage(this.birdImage,  this.x, this.y, this.r * 2, this.r * 2);
   }

  // This is the key function now that decides
  // if it should jump or not jump!
  this.think = function(ipes) {
    // First find the closest pipe
    let closest = null;
    let record = Infinity;
    
    for (let i = 0; i < pipes.length; i++) {
      let diff = pipes[i].x - this.x;
      if (diff > 0 && diff < record) {
        record = diff;
        closest = pipes[i];
      }
    }

    if (closest != null) {
      // Now create the inputs to the neural network
      let inputs = [];
      // x position of closest pipe
      inputs[0] = map(closest.x, this.x, width, 0, 1);
      // top of closest pipe opening
      inputs[1] = map(closest.top, 0, height, 0, 1);
      // bottom of closest pipe opening
      inputs[2] = map(closest.bottom, 0, height, 0, 1);
      // bird's y position
      inputs[3] = map(this.y, 0, height, 0, 1);
      // bird's y velocity
      inputs[4] = map(this.velocity, -5, 5, 0, 1);

      // Get the outputs from the network
      let action = this.brain.activate(inputs);
      // Decide to jump or not!
      if (action[1] > action[0]) {

        this.up();
      }
    }
  }

  // Jump up
  this.up = function(){
    this.velocity += this.lift;
  }

  this.bottomTop = function(){
    // Bird dies when hits bottom?
    return (this.y > height || this.y < 0);
  }

  // Update bird's position based on velocity, gravity, etc.
  this.update = function(){
    this.velocity += this.gravity;
    this.y += this.velocity;
    // Every frame it is alive increases the score
    this.score++;
  }
  this.getScore = function(){
    return this.score;
  }
  return this;
}