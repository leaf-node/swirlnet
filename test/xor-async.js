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


var os, path, swirlnet, swirlnetSolverAsync,
    solveXOR;

os = require('os');
path = require('path');
swirlnetSolverAsync = require('swirlnet-solver-async');

solveXOR = function () {

    "use strict";

    var genomeSettings, netSolveOptions;

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

    netSolveOptions = {};
    netSolveOptions.inputCount = 2;
    netSolveOptions.outputCount = 1;

    netSolveOptions.genomeSettings = genomeSettings;

    netSolveOptions.fitnessTarget = 0.99;
    netSolveOptions.maxGenerations = 200;
    netSolveOptions.doNoveltySearch = false;

    netSolveOptions.useWorkers = true;
    netSolveOptions.workerCount = os.cpus().length;
    /*jslint nomen: true*/
    netSolveOptions.testFile = path.join(__dirname, "xor-async-worker.js");
    /*jslint nomen: false*/

    netSolveOptions.testFunctionOptions = {};
    netSolveOptions.testFunctionOptions.minIterations = 5;
    netSolveOptions.testFunctionOptions.maxIterations = 10;

    return swirlnetSolverAsync(netSolveOptions);
};

solveXOR().catch(function (error) {

    "use strict";

    if (error.stack !== undefined) {
        console.log(error.stack);
    } else {
        console.log(error);
    }
    process.exit(1);
});

