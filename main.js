let { Neat, Network, architect, methods } = carrot;

var cvs = document.getElementById('canvas');
var ctx = cvs.getContext('2d');

var POP = 50;
var GAMES = 70;
var mutation_rate = 1.5;
var mutation_amount = 8.5;
var elitism = Math.round(0.2 * GAMES);
var countGen = 0;

const neat = new Neat(5, 2, {
  population_size: POP,
  elitism: elitism,
  mutation_rate: mutation_rate,
  mutation_amount: mutation_amount,
  equal: false
})

// All active birds (not yet collided with pipe)
let activeBirds = []
// All dead birds in a population
let dead = [];
// Pipes
let pipes = [];
// A frame counter to determine when to add a pipe
let counter = 0;

// Interface elements
let speedSlider;
let speedSpan;
let highScoreSpan;
let allTimeHighScoreSpan;

// All time high score
let highScore = 0;

// Training or just showing the current best
let runBest = false;
let runBestButton;

//Load the background image
 bg = new Image();
 bg.src = "img/background.png";

function setup() {
  //Create an environment for the background of the game
  let canvas = createCanvas(450, 512);
  canvas.parent('canvas');

  // Access the interface elements
  speedSlider = select('#speedSlider');
  speedSpan = select('#speed');

}


function populating() {
  for (let i = 0; i < neat.population.length; i++) {
    activeBirds.push(new Bird(neat.population[i]));
  }
  countGen++;
}

populating()

async function draw() {
  ctx.drawImage(bg, 0, 0, 450, 512);

  // Should we speed up cycles per frame
  let cycles = speedSlider.value();
  speedSpan.html(cycles);

  // How many times to advance the game
  for (let n = 0; n < cycles; n++) {
    // Show all the pipes
    for (let i = pipes.length - 1; i >= 0; i--) {
      pipes[i].update();
      if (pipes[i].offscreen()) {
        pipes.splice(i, 1);
      }
    }

    for (let i = activeBirds.length - 1; i >= 0; i--) {
        let bird = activeBirds[i];
        // Bird uses its brain!
        bird.think(pipes);
        bird.update();

        // Check all the pipes
        for (let j = 0; j < pipes.length; j++) {
          // It's hit a pipe
          if (pipes[j].hits(activeBirds[i])) {
            // Remove this bird
            activeBirds[i].brain.score = activeBirds[i].getScore()
            dead.push(activeBirds.splice(i, 1)[0].brain)
            break;
          }
        }
        if (bird.bottomTop()) {
          activeBirds[i].brain.score = activeBirds[i].getScore()
          dead.push(activeBirds.splice(i, 1)[0].brain)
        }
      }

    // Add a new pipe every so often
    if (counter % 40 == 0) {
      pipes.push(new Pipe());
    }
    counter++;
  }

  // What is highest score of the current population
  let tempHighScore = 0;
  // If we're training
  if (!runBest) {
    // Which is the best bird?
    let tempBestBird = null;
    for (let i = 0; i < activeBirds.length; i++) {
      let s = activeBirds[i].score;
      if (s > tempHighScore) {
        tempHighScore = s;
        tempBestBird = activeBirds[i];
      }
    }

    // Is it the all time high scorer?
    if (tempHighScore > highScore) {
      highScore = tempHighScore;
      bestBird = tempBestBird;
    }
  } else {
    // Just one bird, the best one so far
    tempHighScore = bestBird.score;
    if (tempHighScore > highScore) {
      highScore = tempHighScore;
    }
  }
  // Draw everything!
  for (let i = 0; i < pipes.length; i++) {
    pipes[i].show();
  }

  if (runBest) {
    bestBird.draw();
  } else {
    for (let i = 0; i < activeBirds.length; i++) {
      activeBirds[i].draw();
    }
    // If we're out of birds go to the next generation
    if (activeBirds.length == 0) {
      neat.population = dead

      neat.population = await neat.evolve()

      populating() // replace the activeBirds with the new population

      // reset the dead
      dead = []

      // reset the pipes
      pipes = []
    //  pipes.push(new Pipe())
      counter = 0
    }
  }
  this.ctx.fillStyle = "white";
	this.ctx.font="20px Oswald, sans-serif";

  this.ctx.fillText("Generation: " + countGen, 10,25)
  this.ctx.fillText("Population: " + activeBirds.length + "/" + POP, 10, 50 );
  this.ctx.fillText("High Score: " + highScore, 10, 75);

}
