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

function follow(H, T) {
  let delta = [H[0] - T[0], H[1] - T[1]];

  if( Math.abs(delta[0]) <= 1 && Math.abs(delta[1]) <= 1 ) {
    // nop
  } else {
    // add
    T[0] = T[0] + Math.sign(delta[0]);
    T[1] = T[1] + Math.sign(delta[1]);
  }
}

function getVector(d) {
  if(d === 'U') {
    return [1, 0];
  } else if(d === 'D') {
    return [-1, 0];
  } else if(d === 'L') {
    return [0, -1];
  } else if(d === 'R') {
    return [0, 1];
  }
}

function add(a, b) {
  return [a[0] + b[0], a[1] + b[1]];
}

(async () => {

  let p1map = {'0,0': undefined};
  let p2map = {'0,0': undefined};

  let rope = (new Array(10)).fill([0,0]).map( v => [...v]);

  await processLines('./input.txt', (line) => {
    let command = line.split(' ');
    let vector = getVector(command[0]);
    let iteration = Number(command[1]);
    for( let i = 0; i < iteration; i++) {
      rope[0] = add(rope[0], vector);
      rope.forEach( (_, i) => {
        if( i === 0 ) {
          return;
        } else {
          follow(rope[i - 1], rope[i]);
        }
      });
      p1map[rope[1].join(',')] = undefined;
      p2map[rope[9].join(',')] = undefined;
    }
  });

  console.log(Object.keys(p1map).length);
  console.log(Object.keys(p2map).length);

})();
