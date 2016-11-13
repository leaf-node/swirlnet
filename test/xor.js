#! /usr/bin/env node

// Copyright 2016 Andrew Engelbrecht
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


// This program evolves neural networks with two inputs and one output. The
// target behavior is mimicry of the logical XOR function. Inputs of 0,0 and
// 1,1 should produce 0, whereas inputs of 1,0 and 0,1 should produce 1.


var swirlnet, solveXOR, runNet,
    genomeSettings, netSettings,
    fitnessTarget, maxGenerations,
    targetFitness, maxGenerations,
    getXORFitness;


targetFitness = 0.9;
maxGenerations = 200;


// when using this library:
// swirlnet = require('swirlnet');
swirlnet = require('../src/index.js');

// settings are optional
genomeSettings = {

    "populationSize":               150,
    "survivalThreshold":            0.2,

    "disjointCoefficient":          1.0,
    "excessCoefficient":            1.0,
    "weightDifferenceCoefficient":  0.4,
    "compatibilityThreshold":       3.0,

    "genomeWeightMutationRate":         0.8,
    "geneUniformWeightPerturbanceRate": 0.0,
    "geneRandomWeightPerturbanceRate":  0.4,
    "geneRandomWeightResetRate":        0.0,

    "weightPerturbanceVariance":    1.0,
    "randomWeightVariance":         5.0,

    "addNodeMutationRate":          0.03,
    "addLinkMutationRate":          0.05,

    "allowRecurrent":               false
};

// search for fittest genome solving XOR challenge
solveXOR = function (fitnessTarget, maxGenerations) {

    "use strict";

    var i, j, population, genomes, genome,
        net, phenotype,
        fitness, bestFitness,
        bestFitnessThisGeneration;

    // arg 0: input count
    // arg 1: output count
    population = swirlnet.makePopulation(2, 1, genomeSettings);

    bestFitness = 0;

    for (i = 0; i < maxGenerations; i += 1) {

        genomes = population.getGenomes();

        bestFitnessThisGeneration = null;

        for (j = 0; j < genomes.length; j += 1) {

            genome = genomes[j];

            // converts from genotype to phenotype format
            phenotype = swirlnet.genoToPheno(genome);
            // creates network object
            net = swirlnet.makeNet(phenotype);

            fitness = getXORFitness(net, 5, 10);

            // sets genome fitness which influences genome reproduction
            population.setFitness(net.getGenomeID(), fitness);

            if (fitness >= fitnessTarget) {

                console.log();
                console.log("winner found in " + (i + 1) + " generations with fitness: " + fitness);
                console.log();
                console.log("winning network:");
                console.log();
                console.log(JSON.parse(phenotype));
                console.log();

                return;
            }

            bestFitnessThisGeneration = (bestFitnessThisGeneration === null || fitness > bestFitnessThisGeneration) ? fitness : bestFitnessThisGeneration;
        }

        console.log("generation: " + i + "  best fitness: " + bestFitnessThisGeneration);
        bestFitness = (bestFitness > bestFitnessThisGeneration) ? bestFitness : bestFitnessThisGeneration;

        population.reproduce();
    }

    console.log();
    console.log("no winner found in " + i + " generations. best fitness: " + bestFitness);
    console.log();
};

// test each test case for multiple iterations and return the overall fitness
getXORFitness = function (net, minIterations, maxIterations) {

    "use strict";

    var results0, results1, results2, results3,
        fitness0, fitness1, fitness2, fitness3,
        fitness, multiply, absOneMinus;

    fitness = 1;

    multiply = function (a, b) { return a * b; };
    absOneMinus = function (x) { return Math.abs(1 - x); };

    results0 = runNet(net, minIterations, maxIterations, 0, 0);
    results1 = runNet(net, minIterations, maxIterations, 1, 1);
    results2 = runNet(net, minIterations, maxIterations, 0, 1);
    results3 = runNet(net, minIterations, maxIterations, 1, 0);

    // fitness of 1 for outputs of 0
    fitness0 = results0.map(absOneMinus).reduce(multiply);
    fitness1 = results1.map(absOneMinus).reduce(multiply);
    // fitness of 1 for outputs of 1
    fitness2 = results2.map(Math.abs).reduce(multiply);
    fitness3 = results3.map(Math.abs).reduce(multiply);

    fitness *= fitness0 * fitness1 * fitness2 * fitness3;

    return fitness;
};

// run a test case and collect outputs from multiple iterations
runNet = function (net, minIterations, maxIterations, input0, input1) {

    "use strict";

    var i, results;

    results = [];

    // sets all node states to 0
    net.flush();
    // sets states of input nodes
    net.setInputs([input0, input1]);

    for (i = 0; i < maxIterations; i += 1) {

        // step network forward by propagating signals to downstream nodes
        net.step();

        if (i >= minIterations - 1) {
            // getOutputs(): get list of output node states
            results.push(net.getOutputs()[0]);
        }

    }

    return results;
};

solveXOR(targetFitness, maxGenerations);

