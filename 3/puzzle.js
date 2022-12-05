
const fs = require('fs');
const readline = require('readline');
const events = require('events');
const { group } = require('console');

async function processLines(filename, handler) {
  const rl = readline.createInterface({
    input: fs.createReadStream(filename),
    crlfDelay: Infinity
  });
  rl.on('line', handler);
  await events.once(rl, 'close');
}

function score(item) {
  let score = " abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(item);
  return score > 0 ? score:0;
}

function intersection(...arrays) {
  return arrays[0].filter( x =>
    arrays.slice(1).map( a => a.includes(x) ).every( t => t)
  );
}

(async () => {
  let p1score = 0;
  let p2score = 0;

  let group_index = -1;
  let group_set = [[], [], []];
  await processLines('./input.txt', (line) => {
    let one = line.slice(0, line.length / 2).split('');
    let two = line.slice(line.length / 2).split('');
    p1score += score(intersection(one, two)[0]);

    group_index = (group_index + 1) % 3;
    group_set[group_index] = line.split('');
    if(group_index === 2) {
      let badge = intersection(...group_set)[0]
      p2score += score(badge);
      group_set = [[],[],[]];
    }
  });
  console.log(p1score);
  console.log(p2score);
})();