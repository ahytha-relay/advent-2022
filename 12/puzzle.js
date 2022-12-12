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

function getHeight(c) {
  return c.charCodeAt(0) - 97;
}

function neighbors(map, p) {
  let [x, y] = p.point.split(',').map(Number);
  return [
    [x-1, y],
    [x+1, y],
    [x, y-1],
    [x, y+1],
  ].filter( n => map[n] !== undefined)
   .map(n => map[n]);
}

function updatePoint(map, p) {
  let n_dist = neighbors(map, p)
    .filter( n => n.dist !== undefined)
    .filter( n => (n.height - p.height) < 2);
  p.dist = Math.min(...n_dist) + 1;
  p.checked = true;
}

// function propogateMinDist(map, x, y) {
//   let self = map[[x, y]];
//   self.checked = true;
//   neighbors(map, x, y).map( n => {
//     let is_accessible = (self.height - map[n].height) < 2;
//     let is_defined = map[n].dist !== undefined;
//     let is_further = map[n].dist > (self.dist + 1);

//     if (is_accessible && !is_defined) {
//       map[n].dist = self.dist + 1;
//       propogateMinDist(map, ...n);
//     } else if (is_accessible && is_defined && is_further) {
//       map[n].dist = self.dist + 1;
//       propogateMinDist(map, ...n);
//     }
//   });
// }

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
  let map = {};
  let end = [];
  let start = [];
  await processLines('./input.txt', (line, i) => {
    line.split('').forEach( (c, j) => {
      let height;
      let dist;
      let point = String([i, j]);
      if( c === 'S') {
        height = getHeight('a');
        dist = undefined;
        start = point;
      } else if (c === 'E') {
        height = getHeight('z');
        dist = 0;
        end = point;
      } else {
        height = getHeight(c);
        dist = undefined;
      }
      map[point] = { height, dist, c, point };
      jmax = Math.max(jmax, j);
    });
    imax = Math.max(imax, i);
  });

  // propogateMinDist(map, ...end);
  let set = neighbors(map, map[end]).map( n => [n, 1]);
  let dist = 0;
  while( set.length > 0 ) {
    dist++;
    let [p, d] = set.shift();
    if( p.dist === undefined ) {
      p.dist = d;
      p.checked = true;
      neighbors(map, p)
        .filter( n => (p.height - n.height) < 2)
        .forEach( n => { set.push([n, d + 1]) })
    }
  }
  debug(map);
  console.log(map[start].dist);

  let best_trail = Object.values(map).filter( p => p.c === 'a').map(p => p.dist).sort( (a, b) => a - b);
  console.log(best_trail[0]);

})();
