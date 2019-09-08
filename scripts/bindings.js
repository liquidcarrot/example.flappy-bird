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
   data: bindings
 })
