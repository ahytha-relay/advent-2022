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

function processMonkey(strings) {
  let values = {
    id: Number(strings[0].split(' ')[1].slice(0, -1)),
    items: strings[1].split('Starting items:')[1].replace(/\s+/g, '').split(',').map(Number),
    operation: strings[2].split('Operation: new = ')[1],
    test: Number(strings[3].split(' ').at(-1)),
    test_true: Number(strings[4].split(' ').at(-1)),
    test_false: Number(strings[5].split(' ').at(-1)),
  }

  return {
    id: values.id,
    items: values.items,
    test_value: values.test,
    operation: (worry) => {
      let old = worry;
      return eval(values.operation);
    },
    throw_target: (worry) => {
      if (worry % values.test === 0) {
        return values.test_true;
      } else {
        return values.test_false;
      }
    },
    has_inspected: 0
  }
}


(async () => {
  let monkeys = [];
  let buffer = [];
  await processLines('./input.txt', (line) => {
    if( line !== '' ) {
      buffer.push(line);
    }
    if( buffer.length === 6 ) {
      monkeys.push(processMonkey(buffer));
      buffer = [];
    }
  });

  // let round_target = 20;
  let round_target = 10000;
  let mod_space = monkeys.reduce( (acc, m) => acc * m.test_value, 1);

  for( let i = 0; i < round_target; i++) {
    monkeys.forEach( (monkey) => {
      monkey.items.forEach( (item) => {
        let worry = monkey.operation(item);

        // worry = Math.floor(worry / 3);
        worry = worry % mod_space;

        let target = monkey.throw_target(worry);
        monkeys[target].items.push(worry);
        monkey.has_inspected += 1;
      })
      monkey.items = [];
    });
  }

  let inspections = monkeys.map( m => m.has_inspected).sort((a, b) => b - a);
  console.dir(inspections[0] * inspections[1]);


})();
