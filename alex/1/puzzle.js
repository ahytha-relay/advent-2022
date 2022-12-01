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

(async () => {

  let elfSet = [0];
  await processLines('../../input/1/input.txt', (line) => {
    if( line === '') {
      elfSet.push(0);
    } else {
      elfSet[elfSet.length - 1] += Number(line);
    }
  });

  let sorted_set = elfSet.sort( (a, b) => a - b);
  console.log(sorted_set.slice(-1).reduce((a, b) => a + b, 0));
  console.log(sorted_set.slice(-3).reduce((a, b) => a + b, 0));

})();