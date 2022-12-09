import { Field, Experimental, isReady, shutdown, Poseidon } from 'snarkyjs';

let Prover = Experimental.ZkProgram({
  publicInput: Field,

  methods: {
    small: {
      privateInputs: [],

      method(publicInput: Field) {
        for (let index = 0; index < 2 ** 4 / 12; index++) {
          Poseidon.hash([Field(0)]);
        }
      },
    },
    medium: {
      privateInputs: [],

      method(publicInput: Field) {
        for (let index = 0; index < 2 ** 15 / 12; index++) {
          Poseidon.hash([Field(0)]);
        }
      },
    },
    large: {
      privateInputs: [],

      method(publicInput: Field) {
        for (let index = 0; index < 63000 / 12; index++) {
          Poseidon.hash([Field(0)]);
        }
      },
    },
  },
});
async function benchmark(
  f: () => Promise<void>,
  msg: string
): Promise<{
  duration: number;
  result: string;
  success: boolean;
  print: () => void;
}> {
  let startTime = 0,
    endTime = 0;

  try {
    startTime = Date.now();
    await f();
    endTime = Date.now();
  } catch (error: any) {
    return {
      success: false,
      duration: (Date.now() - startTime) / 1000,
      result: error,
      print: () =>
        console.log(
          `BENCH: FAILURE - Could not execute benchmark.\n\n${error}`
        ),
    };
  }
  return {
    duration: (endTime - startTime) / 1000,
    result: msg,
    success: true,
    print: () =>
      console.log(
        `BENCH: SUCCESS - ${msg}, in ${(endTime - startTime) / 1000}s.`
      ),
  };
}

async function run() {
  await isReady;

  console.log('starting benchmark');
  let res;

  res = await benchmark(async () => {
    await Prover.compile();
  }, 'compiling prover');
  res.print();

  console.log('proving..');

  let stats = {
    small: {
      n: 0,
      s: 0,
    },
    medium: {
      n: 0,
      s: 0,
    },
    large: {
      n: 0,
      s: 0,
    },
  };

  for (let index = 0; index < 10; index++) {
    res = await benchmark(async () => {
      await Prover.small(Field(0));
    }, 'proving small prover');
    res.print();
    stats.small.n += 1;
    stats.small.s += res.duration;

    res = await benchmark(async () => {
      await Prover.medium(Field(0));
    }, 'proving medium prover');
    res.print();
    stats.medium.n += 1;
    stats.medium.s += res.duration;

    res = await benchmark(async () => {
      await Prover.large(Field(0));
    }, 'proving large circuit');
    res.print();
    stats.large.n += 1;
    stats.large.s += res.duration;
  }

  console.log('done - result');

  console.log(`
    Small: ${stats.small.n} runs, average ${stats.small.s / stats.small.n}
    Medium: ${stats.medium.n} runs, average ${stats.medium.s / stats.medium.n}
    Large: ${stats.large.n} runs, average ${stats.large.s / stats.large.n}
  `);

  shutdown();
}

run();
