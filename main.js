let { Neat, Network, architect, methods } = carrot;

var cvs = document.getElementById('canvas');
var ctx = cvs.getContext('2d');

const POP = 50;
const GAMES = 60;
const mutation_rate = 0.5;
const mutation_amount = 3;
const elitism = Math.round(0.2 * GAMES);

const neat = new Neat(5, 2, {
  population_size: POP,
  elitism: elitism,
  mutation_rate: mutation_rate,
  mutation_amount: mutation_amount,
  equal: false
})

neat.population = neat.population.map(function(genome) {
    
  // grab a random mutation method
  const random_mutation_method = methods.mutation.FFW[Math.floor(Math.random() * methods.mutation.FFW.length)]
  
  console.log(genome)
  
  // mutate the genome
  genome.mutate(random_mutation_method)
  
  console.log(genome)
  
  // return the mutated genome
  return genome
})

console.log(neat.population)


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
  
  // Create a population
  for (let i = 0; i < neat.population.length; i++) {
    activeBirds.push(new Bird(neat.population[i]));
  }
  console.log(activeBirds)
}

// Toggle the state of the simulation
function toggleState() {
  runBest = !runBest;
  // Show the best bird
  if (runBest) {
    //resetGame();
    runBestButton.html('continue training');
    // Go train some more
  } else {
    //nextGeneration();
    runBestButton.html('run best');
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
      //activeBirds[i].show();
      activeBirds[i].draw();
    }
    // If we're out of birds go to the next generation
    if (activeBirds.length == 0) {
     // nextGeneration();
    }
  }
}