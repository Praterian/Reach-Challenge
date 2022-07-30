import { loadStdlib } from '@reach-sh/stdlib';
import * as backend from './build/index.main.mjs';
const stdlib = loadStdlib(process.env);

const startingBalance = stdlib.parseCurrency(100);

const accBob = await stdlib.newTestAccount(startingBalance);

const accAlice = await stdlib.newTestAccount(stdlib.parseCurrency(6000))
console.log('Hi, Alice and Bob!')

console.log('Starting...');
const ctcAlice = accAlice.contract(backend);
const ctcBob = accBob.contract(backend, ctcAlice.getInfo());

const choiceArray = ["I'm not here", "I'm still here"];

const getBalance = async (who) => stdlib.formatCurrency((await stdlib.balanceOf(who)));

console.log(`Alice's balance before is: ${await getBalance(accAlice)}`);
console.log(`Bob's account balance before is: ${await getBalance(accBob)}`);

const Shared = () => ({
    showTime: (t) => {
        console.log(parseInt(t));
    },
});

console.log('Starting backends...');
await Promise.all([
    backend.Alice(ctcAlice, {
        ...stdlib.hasRandom,
        ...Shared(),
        inherit: stdlib.parseCurrency(5000),
        getChoice: () => {
            const choice = Math.floor(Math.random() * 2);
            console.log(`Alice's choice is ${choiceArray[choice]}`);
            return (choice == 0 ? false : true);
        },
    }),
    backend.Bob(ctcBob, {
        ...stdlib.hasRandom,
        ...Shared(),
        acceptTerms: (num) => {
            console.log(`Bob accepts the terms of The Vault for ${stdlib.formatCurrency(num)}`);
            return true;
        }
    }),
]);

console.log(`Alice's balance after is: ${await getBalance(accAlice)}`);
console.log(`Bob's account balance after is: ${await getBalance(accBob)}`);

console.log('See you later, Alice and Bob!')

// Praterian#4444