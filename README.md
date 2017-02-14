# swirlnet

This is part of a neural network evolution library named swirlnet.

swirlnet is similar to NEAT (NeuroEvolution of Augmenting Topologies), but its
feature set and behavior is somewhat different. For a partial list of
differences, refer to the `VS-NEAT.md` file in this repository.

## Installation

    $ npm install swirlnet

## Documentation

See the `API.md` file in this repo for API documentation.

See the `test/xor-demo.js` or `test/xor-async.js` and
`test/xor-async-worker.js` files for a demonstration of swirlnet's capability.

    $ node ./test/xor-demo.js

    $ npm install swirlnet-solver-async
    $ node ./test/xor-async.js

## Status

The API of this library is currently unstable.

## License

This software is licensed under the Apache License, Version 2.0.

Networks, genomes and phenotypes that you evolve with this library are released
to you under CC0.

