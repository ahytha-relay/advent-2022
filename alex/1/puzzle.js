const fs = require('fs');
const readline = require('readline');
const events = require('events');

async function processLines(filename, handler) {
  const rl = readline.createInterface({
    input: fs.createReadStream(filename),
    crlfDelay: Infinity
  });
  rl.on('line', handler);
  await events.once(rl, 'close');
}

class Elf {
  provisions;
  constructor() {
    this.provisions = []
  }
  get totalCalories() {
    return this.provisions.reduce( (prev, curr) => prev + curr, 0);
  }
  addProvisions(calories) {
    this.provisions.push(calories);
  }
}

function trimToTopThree(set, n) {
  set.sort().slice(-3);
}

(async () => {

  let elfSet = [new Elf()];
  await processLines('../../input/1/input.txt', (line) => {
    if( line === '') {
      elfSet.push(new Elf());
    } else {
      elfSet.at(-1).addProvisions(Number(line));
    }
  });

  let sorted_set = elfSet.map(e => e.totalCalories).sort( (a, b) => a - b);
  console.log(sorted_set.slice(-1).reduce((a, b) => a + b, 0));
  console.log(sorted_set.slice(-3).reduce((a, b) => a + b, 0));

})();