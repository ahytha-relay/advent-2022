const fs = require('fs');
const readline = require('readline');
const events = require('events');

async function processLines(filename, handler) {
  const rl = readline.createInterface({
    input: fs.createReadStream(filename),
    crlfDelay: Infinity
  });
  let i = 0;
  rl.on('line', (event) => { handler(event, i); i++ });
  await events.once(rl, 'close');
}

function compare(a, b) {
  if( Number.isInteger(a) && Number.isInteger(b) ) {
    if( a < b) {
      return true;
    } else if( a === b ) {
      return undefined;
    } else {
      return false;
    }

  } else if( Array.isArray(a) && Array.isArray(b) ) {
    for( let i = 0; i < Math.max(a.length, b.length); i++) {
      let result = compare(a[i], b[i]);
      if( result === true ) return true;
      if( result === false ) return false; 
      // don't early return on undefined results
    }

  } else if(a === undefined && b !== undefined) {
    return true;

  } else if(a !== undefined && b === undefined) {
    return false;

  } else if( !Array.isArray(a) && Array.isArray(b) ) {
    return compare([a], b);

  } else if( Array.isArray(a) && !Array.isArray(b) ) {
    return compare(a, [b]);

  }

}


let imax = 0;
let jmax = 0;
function debug(map) {
  let debug = '';
  for( let i = 0; i < imax; i++ ) {
    for( let j = 0; j < jmax; j++) {
      let self = map[String([i, j])];
      color = (Math.floor((self.dist ?? 200)) * 2) % 255;
      debug += `\x1B[38;2;${color};${255 - color};${color}m${self.c}\x1B[m`;
    }
    debug += '\n';
  }
  console.log(debug);
}


(async () => {
  let buffer = [];
  let pairs = [];
  await processLines('./input.txt', (line, i) => {
    if( line !== '') {
      buffer.push(JSON.parse(line))
    }

    if( buffer.length === 2) {
      pairs.push(buffer);
      buffer = [];
    }
  });

  let correctPairSum = pairs.map( (p, i) => {
    if( compare(p[0], p[1]) !== false ) {
      return i + 1
    }
  }).filter(e => e !== undefined)
    .reduce((acc, e) => acc + e, 0);
  console.dir(correctPairSum);

  // P2

  let packets = pairs.flat();
  let da = [[2]];
  let db = [[6]];
  packets.push(da, db)
  packets.sort((a, b) => {
    let result = compare(a,b);
    if(result === true) {
      return -1;
    } else if(result === false) {
      return 1;
    } else {
      return 0;
    }
  });
  console.dir((packets.indexOf(da) + 1) * (packets.indexOf(db) + 1));

})();
