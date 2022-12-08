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

function largerThanAll(x, set, log) {
  if(log) { console.log(`checking ${x} - ${set}`); }
  return set.filter(i => i >= x).length === 0;
}

function isVisible(h, x, y, map, log) {
  let vertical = map.map(h => h.at(x));
  let left = map.at(y).slice(0, x);
  let right = map.at(y).slice(x + 1);
  let up = vertical.slice(0, y);
  let down = vertical.slice(y + 1);

  return largerThanAll(h, left, log) ||
         largerThanAll(h, right, log) ||
         largerThanAll(h, up, log) ||
         largerThanAll(h, down, log);
}


function lineScore(h, line) {
  let score = 0;
  for( let t of line) {
    if( t >= h ) {
      return score + 1;
    } else {
      score++;
    }
  }
  return score;
}

function scenicScore(h, x, y, map) {
  let vertical = map.map(h => h.at(x));
  let left = map.at(y).slice(0, x).reverse();
  let right = map.at(y).slice(x + 1);
  let up = vertical.slice(0, y).reverse();
  let down = vertical.slice(y + 1);

  return lineScore(h, left) * lineScore(h, right) * lineScore(h, up) * lineScore(h, down);
}


(async () => {

  let treemap = [];
  await processLines('./input.txt', (line) => {
    treemap.push(line.split('').map(Number));
  });

  let visibleCount = 0;
  let topSceneScore = 0;
  let end = '';

  treemap.forEach( (y, i) => {
    end += '\n';
    y.forEach( (v, j) => {
      topSceneScore = Math.max(topSceneScore, scenicScore(v, j, i, treemap));
      if (isVisible(v, j, i, treemap)) {
        visibleCount += 1;
        end += `\x1B[41m${v}\x1B[m`;
      } else {
        end += `${v}`;
      }
    });
  });

  console.log(end);
  console.log(visibleCount);
  console.log(topSceneScore);


})();