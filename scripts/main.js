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

// Drawing elements
var cvs = document.getElementById('canvas')
var ctx = cvs.getContext('2d')

bg = new Image()
bg.src = "img/background.png"

// Interface elements
let speedSlider
let speedSpan

// Create an environment for the background of the game
function setup() {
  let canvas = createCanvas(450, 512);
  canvas.parent('canvas');

  // Access the interface elements
  speedSlider = select('#speedSlider');
  speedSpan = select('#speed');
}

// Vue bindings
let bindings = {
  // NEAT / population variables
  population_size: 50,
  mutation_rate: 0.9,
  mutation_amount: 2,
  elitism: 5,
  // Game settings
  pipe_spacing: 75, // How often to add a pipe to the game
  // Statistics & visualizations
  champion: { brain: { score: -Infinity } }, // All time best bird
  average: 0
}

// Internal variables
let dead = [] // All dead birds in a population
let pipes = []
let counter = 0 // A frame counter to determine when to add a pipe

// Performance & Statistics
const scoreHistory = [] // Per generation history of total & average score

const neat = new Neat(5, 2, {
  population_size: bindings.population_size,
  elitism: bindings.elitism,
  mutation_rate: bindings.mutation_rate,
  mutation_amount: bindings.mutation_amount,
  mutation: methods.mutation.FFW,
  equal: false
})

neat.generation = 1

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
  if(best.brain.score > bindings.champion.brain.score) {
    bindings.champion = best
    
  }

  // Draw pipes
  for (let i = 0; i < pipes.length; i++) pipes[i].show()

  // Draw birds
  for (let i = 0; i < activeBirds.length; i++) activeBirds[i].draw()

  // If we're out of birds go to the next generation
  if (activeBirds.length == 0) {
    // Calculate generation performance
    const total = neat.population.reduce((sum, brain) => sum + brain.score, 0)
    const average = total / neat.population.length
    scoreHistory.push({ generation: neat.generation, average, total })

    bindings.average = average

    neat.population = dead
    // Check for population resize
    if(bindings.population_size !== neat.population.length) {
      neat.population = neat.resize(bindings.population_size).map(function(genome) {
        genome.score = (genome.score) ? genome.score : 0 // add scores for the new population members
        return genome
      })
    }
    neat.elitism = Number(bindings.elitism) // Avoid implicit type coercion, adjust elitism before evolve
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
  this.ctx.fillText("High Score: " + bindings.champion.brain.score, 10, 75)
}
