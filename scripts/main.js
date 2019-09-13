let { Neat, Network, architect, methods } = carrot;

/* Utility functions */

/**
* Returns max
*
* @param {object[]} array An array of objects
* @param {string} parameter A parameter to compare
*
* @returns {object} Object with max parameter value
*/
let max = function(array, parameter) {
  let max = null

  for (let i = 0; i < array.length; i++) {
    const current  = array[i].brain[parameter] // structural assumption with .brain

    if (current > max) {
      max = current
      best = array[i]
    }
  }

  return best
}

/* Declarations & Initializations */

var cvs = document.getElementById('canvas');
var ctx = cvs.getContext('2d');

// Create an environment for the background of the game
function setup() {
  let canvas = createCanvas(450, 512);
  canvas.parent('canvas');

  // Access the interface elements
  speedSlider = select('#speedSlider');
  speedSpan = select('#speed');
}

let bindings = {
  // NEAT / population variables
  population_size: 50,
  mutation_rate: 0.5,
  mutation_amount: 8,
  elitism: 5,
  // Game settings
  pipe_spacing: 75, // How often to add a pipe to the game
}

// Internal variables
let dead = [] // All dead birds in a population
let pipes = []
let counter = 0 // A frame counter to determine when to add a pipe

// Interface elements
let speedSlider
let speedSpan

// All time best bird
let champion = { score: -Infinity }

//Load the background image
 bg = new Image();
 bg.src = "img/background.png";

const neat = new Neat(8, 2, {
  population_size: bindings.population_size,
  elitism: bindings.elitism,
  mutation_rate: bindings.mutation_rate,
  mutation_amount: bindings.mutation_amount,
  equal: false
})

const populate = population => population.map(brain => new Bird(brain))

let activeBirds = populate(neat.population)

async function draw() {
  ctx.drawImage(bg, 0, 0, 450, 512);

  // Should we speed up cycles per frame
  let cycles = speedSlider.value();
  speedSpan.html(cycles);

  // How many times to advance the game
  for (let n = 0; n < cycles && activeBirds && activeBirds.length; n++) {
    pipes = pipes.filter(pipe => {
      pipe.reposition()
      return pipe.isVisible()
    })

    activeBirds = activeBirds.filter(bird => {
      bird.act(pipes)
      bird.update()

      if(pipes.length && (pipes[0].hits(bird) || bird.offscreen())) {
        dead.push(bird.brain)
        return false
      }

      return true
    })

    // Add a new pipe every so often
    if (counter % bindings.pipe_spacing == 0) pipes.push(new Pipe())
    counter++;
  }

  // Update best bird
  const best = max(activeBirds, "score")
  champion = (best.score > champion.score) ? best : champion

  // Draw pipes
  for (let i = 0; i < pipes.length; i++) pipes[i].show()

  // Draw birds
  for (let i = 0; i < activeBirds.length; i++) activeBirds[i].draw()

  // If we're out of birds go to the next generation
  if (activeBirds.length == 0) {

    neat.population = dead
    activeBirds = populate(await neat.evolve())

    // reset
    dead = []
    pipes = []
    counter = 0
  }

  this.ctx.fillStyle = "white";
	this.ctx.font="20px Oswald, sans-serif";

  this.ctx.fillText("Generation: " + neat.generation, 10,25)
  this.ctx.fillText("Population: " + activeBirds.length + "/" + bindings.population_size, 10, 50 );
  this.ctx.fillText("High Score: " + champion.brain.score, 10, 75)
}
