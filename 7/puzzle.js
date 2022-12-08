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

class Node {
  constructor(name, size) {
    this.name = name;
    this.size = size ?? undefined;
    this.children = {};
  }
  addNode(node) {
    this.children[node.name] = node;
  }
  getNode(name) {
    return this.children[name];
  }
  getChildren() {
    return Object.values(this.children);
  }
  getSize() {
    return this.getChildren().reduce( n => n.size ?? n.getSize(), 0 );
  }
}

(async () => {

  let stack = [];
  let sizes = {};
  await processLines('./input.txt', (line) => {
    let text = line.split(' ');
    if( text[0] === '$' && text[1] === 'cd' && text[2] === '/') {
      stack = ['/'];

    } else if( text[0] === '$' && text[1] === 'cd' && text[2] === '..') {
      stack.pop();

    } else if( text[0] === '$' && text[1] === 'cd') {
      stack.push(`${stack.at(-1)}${text[2]}/`);

    } else if( text[0] === 'dir' ) {
      // stack[-1].addNode(new Node(text[1]));

    } else if( !isNaN(text[0]) ) {
      // stack[-1].addNode(new Node(text[1], Number(text[0])));
      // stack.push(`${stack[-1]}/${text[1]}`);
      stack.forEach( d => {
        sizes[d] = (sizes[d] ?? 0) + Number(text[0]);
      });
      // stack.pop();

    }

  });

  let p1Total = Object.values(sizes).filter( s => s < 100000).reduce( (acc, s) => acc + s, 0)
  console.log(p1Total);

  let availableSpace = 70000000 - sizes['/'];
  let requiredSpace = 30000000 - availableSpace;
  let p2Size = Object.values(sizes).filter( s => s > requiredSpace).sort((a,b) => a-b);
  console.log(p2Size[0]);

})();