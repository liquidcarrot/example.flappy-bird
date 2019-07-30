let { Neat, Network, architect, methods } = carrot;

var cvs = document.getElementById('canvas');
var ctx = cvs.getContext('2d');

var POP = 50;
var GAMES = 70; //60 70
var mutation_rate = 0.1; //0.5, .1
var mutation_amount = 5; //3, 5
var elitism = Math.round(0.2 * GAMES);

const neat = new Neat(5, 2, {
  population: POP,
  elitism: elitism,
  mutation_rate: mutation_rate,
  mutation_amount: mutation_amount,
  equal: false
})

// How big is the population
//let totalPopulation = 50;
// All active birds (not yet collided with pipe)
let activeBirds = []
// All birds for any given population
let currentGeneration = [];
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
  
  let canvas = createCanvas(450, 512);
  canvas.parent('canvas');

  // Access the interface elements
  speedSlider = select('#speedSlider');
  speedSpan = select('#speed');
  highScoreSpan = select('#hs');
  allTimeHighScoreSpan = select('#ahs');
  runBestButton = select('#best');
  runBestButton.mousePressed(toggleState);
}


// Toggle the state of the simulation
function toggleState() {
  runBest = !runBest;
  // Show the best bird
  if (runBest) {
    runBestButton.html('continue training');
    // Go train some more
  } else {
    runBestButton.html('run best');
  }
}


function populating() {
  neat.population = neat.population.map(function(genome) { 
    // grab a random mutation method
    const random_mutation_method = methods.mutation.FFW[Math.floor(Math.random() * methods.mutation.FFW.length)]
    // mutate the genome
    genome.mutate(random_mutation_method)
    // return the mutated genome
    return genome
  })
  for (let i = 0; i < neat.population.length; i++) {
    activeBirds.push(new Bird(neat.population[i]));
  }
}



function draw() {
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
    // Are we just running the best bird
    
      // Or are we running all the active birds
      // Create a population
  
    //populating(); 
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
             activeBirds[i].brain.score = activeBirds[i].getScore();
             currentGeneration.push(activeBirds.splice(i, 1).brain);
            break;
          }
        }

        if (bird.bottomTop()) {
          activeBirds.splice(i, 1);
        }

      }
    

    // Add a new pipe every so often
    if (counter % 75 == 0) {
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

  // Update DOM Elements
  highScoreSpan.html(tempHighScore);
  allTimeHighScoreSpan.html(highScore);

  // Draw everything!
  for (let i = 0; i < pipes.length; i++) {
    pipes[i].show();
  }

  if (runBest) {
    //bestBird.show();
    bestBird.draw();
  } else {
    for (let i = 0; i < activeBirds.length; i++) {
      activeBirds[i].draw();
    }
    // If we're out of birds go to the next generation
    if (activeBirds.length == 0) {
      neat.sort(); 

      const newGeneration = []
    // gets the best of previous generation and inserts them into the next population
    for (let i = 0; i < elitism; i++) {
        newGeneration.push(neat.population[i])
    }
    // test to see if parent gets returned
    for (let i = 0; i < POP - elitism; i++) {
      newGeneration.push(neat.getOffspring())
    }

   neat.population = newGeneration

    populating(); 
    }
  }
}
