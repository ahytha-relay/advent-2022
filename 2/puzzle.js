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

function roundScoreP1(theirs, mine) {
  let choice_score = 0;
  switch (mine) {
    case 'X': choice_score = 1; break;
    case 'Y': choice_score = 2; break;
    case 'Z': choice_score = 3; break;
  }

  let result_score = 0;
  switch (`${theirs} ${mine}`) {
    case 'A X': result_score = 3; break;
    case 'B Y': result_score = 3; break;
    case 'C Z': result_score = 3; break;
    case 'A Y': result_score = 6; break;
    case 'B Z': result_score = 6; break;
    case 'C X': result_score = 6; break;
  }

  return choice_score + result_score;
}

function roundScoreP2(theirs, mine) {
  let choice_score = 0;
  switch (`${theirs} ${mine}`) {
    case 'A X': choice_score = 3; break;
    case 'A Y': choice_score = 1; break;
    case 'A Z': choice_score = 2; break;
    case 'B X': choice_score = 1; break;
    case 'B Y': choice_score = 2; break;
    case 'B Z': choice_score = 3; break;
    case 'C X': choice_score = 2; break;
    case 'C Y': choice_score = 3; break;
    case 'C Z': choice_score = 1; break;
  }

  let result_score = 0;
  switch (mine) {
    case 'X': result_score = 0; break;
    case 'Y': result_score = 3; break;
    case 'Z': result_score = 6; break;
  }

  return choice_score + result_score;
}

(async () => {
  let p1score = 0;
  let p2score = 0;
  await processLines('./input.txt', (line) => {
    elements = line.split(' ');
    p1score += roundScoreP1(elements[0], elements[1]);
    p2score += roundScoreP2(elements[0], elements[1]);
  });
  console.log(p1score);
  console.log(p2score);
})();