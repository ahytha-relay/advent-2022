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

function buildDeDupeBuffer(length) {
  let buffer = (new Array(length)).fill('');
  let marked = false;
  return (char, i) => {
    buffer.shift();
    buffer.push(char);
    if( !hasDuplicates(buffer) && !buffer.includes('') && !marked ) {
      console.log(`index: ${i+1} - length: ${length} - buffer: ${buffer}`);
      marked = true;
    }
  }
}


function hasDuplicates(array) {
  return (new Set(array)).size !== array.length;
}

function startPacketMarker(array) {
  return !hasDuplicates(array) && !array.includes('');
}

function startMessageMarker(array) {
  return !hasDuplicates(array) && !array.includes('');
}

(async () => {

  await processLines('./input.txt', (line) => {
    let chars = line.split('');
    let packetBuffer = buildDeDupeBuffer(4);
    let messageBuffer = buildDeDupeBuffer(14);

    chars.forEach( (c, i) => {
      packetBuffer(c, i);
      messageBuffer(c, i);
    });

  });


})();