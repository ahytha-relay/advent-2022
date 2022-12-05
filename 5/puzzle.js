
const fs = require('fs');
const readline = require('readline');
const events = require('events');

let stacks = [
  '',
  'FHBVRQDP',
  'LDZQWV',
  'HLZQGRPC',
  'RDHFJVB',
  'ZWLC',
  'JRPNTGVM',
  'JRLVMBS',
  'DPJ',
  'DCNWV',
];
let stacks1 = stacks.map(x => x.split(''));
let stacks2 = stacks.map(x => x.split(''));


async function processLines(filename, handler) {
  const rl = readline.createInterface({
    input: fs.createReadStream(filename),
    crlfDelay: Infinity
  });
  rl.on('line', handler);
  await events.once(rl, 'close');
}

(async () => {
  let p1score = 0;
  let p2score = 0;

  await processLines('./input.txt', (line) => {
    let [_a, num, _b, source, _c, dest] = line.split(' ').map(Number);
    for( let i = 0; i < Number(num); i++) {
      stacks1[dest].push(stacks1[source].pop());
    }
    let ministack = stacks2[source].slice(-num);
    stacks2[source] = stacks2[source].slice(0, -num);
    stacks2[dest] = stacks2[dest].concat(...ministack);
  });
  console.log(stacks1.slice(1).map(s => s.pop()).reduce( (acc, x) => acc + x, ''));
  console.log(stacks2.slice(1).map(s => s.pop()).reduce( (acc, x) => acc + x, ''));
})();