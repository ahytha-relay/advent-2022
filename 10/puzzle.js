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

  let tape = [];

  await processLines('./input.txt', (line) => {
    let command = line.split(' ');
    if( command[0] === 'noop' ) {
      tape.push(['noop', 0]);
    } else if( command[0] === 'addx' ) {
      tape.push(['noop', 0]);
      tape.push(['addx', Number(command[1])]);
    }
  });


  let x = 1;
  let p1Strength = 0;
  let screen = [];
  tape.forEach( ([c, v], i) => {
    // the cycle is 1 indexed, so we need to adjust the index to match
    if((i + 21) % 40 === 0) {
      // console.log(`${c} ${v} -> X: \x1B[41m${x}\x1B[m`);
      p1Strength += x * (i + 1);
    } else {
      // console.log(`${cmd} ${val} -> X: ${x}`);
    }

    let xpos = i % 40;
    if( Math.abs(x - xpos) < 2 ) {
      screen.push('\x1B[41m#\x1B[m');
    } else {
      screen.push('.');
    }

    if(xpos === 39) {
      screen.push('\n');
    }

    if( c === 'addx' ) {
      x += v;
    }

  });


  console.log(p1Strength);
  console.log(screen.join(''));

})();
