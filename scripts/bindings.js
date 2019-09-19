/**
 * External variables from main.js
 *
 * ---- NEAT / Population Variables
 *
 * population_size - Size of genetic population
 * elitism - Amount of fittest genomes inserted into next population without mutation.
 * mutation_rate - A number between 0 and 1 that sets a probability of mutation
 * mutation_amount - Amount of mutations to perform when mutating
 *
 * ---- Game Environment Variables
 *
 * pipe_spacing - How often to add a pipe to the game
 *
 */

 let app = new Vue({
   el: '#app',
   data: bindings,
   methods: {
     save: async function(brain) {
       localStorage.setItem("flappy_bird_champion", JSON.stringify(brain.toJSON()))
     },
     restore: async function () {
       const template = Network.fromJSON(JSON.parse(localStorage.getItem("flappy_bird_champion")))
       const population = []
       for(let i = 0; i < this.population_size; i++) population.push(template.clone())
       activeBirds = populate(population) // assumes activeBirds is in scope
     }
   }
 })
