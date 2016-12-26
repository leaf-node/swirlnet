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


// This worker sub-program tests the fitness of neural networks as they attempt
// to perform XOR behavior.


/*global Promise */

var getXORFitness, runNet;

// test each test case for multiple iterations and return the overall fitness
getXORFitness = function (net, options) {

    "use strict";

    var results0, results1, results2, results3,
        fitness0, fitness1, fitness2, fitness3,
        fitness, multiply, absOneMinus,
        minIterations, maxIterations;

    minIterations = options.minIterations;
    maxIterations = options.maxIterations;

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

    return Promise.resolve({"fitness": fitness});
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

module.exports = getXORFitness;

