# swirlnet

This is part of a neural network evolution library named swirlnet.

swirlnet is similar to NEAT (NeuroEvolution of Augmenting Topologies), but its
feature set and behavior is somewhat different. For a partial list of
differences, refer to the `VS-NEAT.md` file in this repository.

## Installation

    $ npm install swirlnet

If you want to try the demos, you'll need to:

    $ cd node_modules/swirlnet

... then follow the instructions below.

## Documentation

Most swirlnet code is not in this particular repository. To see the related
code, either perform the above installation instructions, or browse the other
[swirlnet repos](https://github.com/leaf-node?tab=repositories&q=swirlnet).

See the `API.md` file in this repo for API documentation.

See the `test/xor-demo.js` or `test/xor-async.js` and
`test/xor-async-worker.js` files for a demonstration of swirlnet's capability.

    $ node ./test/xor-demo.js

    $ npm install swirlnet-solver-async
    $ node ./test/xor-async.js

You may also be interested in my [double inverted pendulum
demos](https://github.com/leaf-node/swirlnet-demos).

## License

This software is licensed under the Apache License, Version 2.0.

The authors of swirlnet claim no license over the networks, genomes and
phenotypes evolved using this library. Included demo/test files are licensed
under CC0.

