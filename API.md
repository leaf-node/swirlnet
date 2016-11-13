# API Documentation

This library evolves neural networks that may perform well at various tasks,
including control tasks.

For a full example, see the `./test/xor.js` or the `./test/xor-new.js` and
`./test/xor-worker.js`  programs.

**NOTE:** Instead of directly interfacing with swirlnet, you may wish to use
the **`swirlnet-solver-async`** package. It helps you take advantange of parallel
neural network testing.

        $ npm install swirlnet-solver-async

If you want to use the base library, install it locally into your project's
`node_modules` directory:

        $ npm install swirlnet

(Alternatively, you may wish to install and require individual components
listed in `src/index.js` if you are breaking up your code into small chunks.)

Import the library into your javascript program

        swirlnet = require('swirlnet');

User-defined settings are optional. Default settings and their values may be
found in the `./src/defaults.js` file. Default settings and values may change
in future versions of swirlnet. Refer to the release notes for a listing of
prior changes.

        genomeSettings = {

            "populationSize":   150,
            "allowRecurrent":   true
        };

To get started, make a new population. The first argument is the number of
inputs. The second is the number of outputs. The so-called 'bias' input is
handled automatically by swirlnet.

        population = swirlnet.makePopulation(2, 1, genomeSettings);

Get a list of all the genomes from the current (first) generation

        genomes = population.getGenomes();

Loop through and process each of the genomes. Create a phenotype for each
genome and use that to create each net. This process is broken up into more
than one step and uses text based formats so that you can evolve genomes on one
machine and test them in parallel on many others.

        genome = genomes[i];
        phenotype = swirlnet.genoToPheno(genome);
        net = swirlnet.makeNet(phenotype);

Once you have your net, you can reset its internal cell states to `0` with
`flush()`. This is only needed between multiple tests of the same network.

        net.flush();

Set the inputs to the network

        net.setInputs([0, 1]);

Step the network forward to propagate signals downstream. The optional
parameter may be used for steping multiple times. If inputs are constant, you
don't need to reset inputs before every `step()`.

        net.step(5);

Get the network outputs

        results0 = net.getOutputs();
        net.step();
        results1 = net.getOutputs();

Calculate your network's fitness. In practice you'll want to sample multiple
outputs from a variety of inputs and combine them together using a fitness
formula. Some people wait for network output to stabilize before sampling
results but be aware that some recurrent networks do not stabilize.

        fitness = results0[0] * results1[0];

Set genome fitness. This determines which genomes reproduce to create the next
generation. (genomeIDs start at `0`)

        population.setFitness(net.getGenomeID(), fitness);

Create the next generation

        population.reproduce();

Repeat the above steps until you have a network that meets your fitness target

        genomes = population.getGenomes();
        ...

For a full example, see the `./test/xor.js` program.


## Novelty search

[Novelty search](http://eplex.cs.ucf.edu/noveltysearch/userspage/) rewards
networks for acting differently than their peers and those that came before
them. Networks are rewarded by feeding their calculated "sparsity" (novelty)
(or a combination of sparsity and fitness) to `population.setFitness()`.


To create the archive for logging behaviors and measuring their sparsity:

        options = {};
        options.kNearestNeighbors = 15;
        options.archiveThreshold = 6;

        // optional settings:
        options.maxArchiveSize = 400;
        options.behaviorDistanceFunction = function (v1, v2) { ...; return scalar; };

        archive = swirlnet.makeArchive(options);

kNearestNeighbors` specifies how many of one's nearest neighbors in behavior
space to use in determining a behavior's sparsity. archiveThreshold`specifies
how sparse a behavior must be for it to be archived. maxArchiveSize sets the
upper limit on the allowable size of the archive. When the archive grows beyond
this size, the earlist members are pruned. The default size is Inifity. If your
search typically produces tens of thousands of behaviors before finding a
solution, you may want to reduce the maximum allowable archive size and/or
increase the archive threshold. Finding sparsities becomes slow when there are
many behaviors in an archive. behaviorDistanceFunction`is an optional custom
function used to determine the distance between two behaviors. The default
function measures the spacial distance between two behaviors as if they were
points in multidimensional space.

Add each behavior and genome pair of the current generation. The behaviour must
be an array of numbers, equal in length to every other genome's behavior.

        archive.noteBehavior(behavior, genome)

To get the sparsities of each genome's behavior, use the following function.
Sparsities are returned in the order they were added with `noteBehavior()`.

        archive.getSparsities()

To prepare for the next generation, this function adds highly sparse (novel)
genomes to the archive, clears out other recent behaviors and prunes the
archive size if maxArchiveSize is set.

        archive.archiveAndClear()

To get a copy of the current archive:

        archive.getArchive()

To get the length of the current archive:

        archive.getArchiveLength()


## Other methods

Returns the current generation number (generation numbers start at `0`):

        population.getCurrentGenerationNumber()

Returns a list of internal node states ordered by phenotype node number:

        net.getNodeStates()

Returns the number of nodes in a network:

        net.getNodeCount()

## Default settings

To override any of these settings, refer to the method at the top of this page.

Default settings and their values may be found in the `./src/defaults.js` file.
Default settings and values may change in future versions of swirlnet. Refer to
the release notes for a listing of prior changes.

