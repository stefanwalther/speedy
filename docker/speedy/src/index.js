const speedTest = require('speedtest-net');
const test = speedTest({maxTime: 5000});

console.log('ENV => DB_HOST', process.env.DB_HOST);
console.log('ENV => DB_PORT', process.env.DB_PORT);

test.on('data', data => {
    console.dir(data);
});

test.on('done', data => {
    // console.log('done');
    // console.dir(data);
});

test.on('error', err => {
    console.error(err);
});
