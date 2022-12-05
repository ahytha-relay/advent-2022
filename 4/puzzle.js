
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

function intersection(a, b) {
  return a.filter( x => b.includes(x) );
}

function exclusion(a, b) {
  return [
    ...a.filter( x => !b.includes(x) ),
    ...b.filter( x => !a.includes(x) )
  ];
}

function equals(a, b) {
  return exclusion(a, b).length === 0;
}

function subset(a, b) {
  let i = intersection(a, b);
  return equals(a, i) || equals(b, i);
}

function asRange(str) {
  let split = str.split('-');
  let min = Number(split[0]);
  let max = Number(split[1]);
  return [...Array(max+1).keys()].slice(min);
}

(async () => {
  let p1score = 0;
  let p2score = 0;

  await processLines('./input.txt', (line) => {
    let [one, two] = line.split(',').map(asRange);
    if( subset(one, two) ) {
      p1score += 1;
    }
    if(intersection(one, two).length !== 0) {
      p2score += 1;
    }
  });
  console.log(p1score);
  console.log(p2score);
})();