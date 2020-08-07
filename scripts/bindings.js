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

// Enable vue devtoools
Vue.config.devtools = true

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
     },
     graph: async function(brain) {
       const element = this.$refs.visualization
       const { nodes: neurons, connections } = brain.toJSON()

       // Flattens neuron layers from `Network.toJSON` and converts it to 'vis-network'
       const nodes = new vis.DataSet(neurons.map((neuron, i) => ({
           id: neuron.index,
           title: i,
           label: i,
           color: (neuron.type === "hidden") ? "orange" : (neuron.type === "output") ? "blue" : "yellow"
         })
       ))

       // Flattens connections from `Network.toJSON` and converts it into `vis-network`
       const edges = new vis.DataSet(connections.map(connection => ({
         from: connection.from,
         to: connection.to,
         title: connection.weight,
         color: (connection.weight == 1) ? "white" : (connection.weight > 0) ? "green" : "red"
       })
     ))

       // Vis.js Network Options
       // Will have a "left-to-right" graph with "smooth" lines representing
       // connections by default
       const options = {
         autoResize: true,
         height:'250px',
         width:'100%',
         edges: {
           arrows: {
              to: {enabled: true, scaleFactor:1, type:'arrow'}
            },
           smooth: {
             type: "cubicBezier",
             forceDirection: "horizontal"
           }
         },
         layout: {
           hierarchical: {
             direction: "LR",
             sortMethod: "directed"
           }
         },
         physics: false
       }

       let network = new vis.Network(element, { nodes, edges }, options)
     }
   }
 })
