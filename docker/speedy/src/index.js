const Influx = require('influx');
const influx = new Influx.InfluxDB({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  schema: [
    {
      measurement: 'speed_test',
      fields: {
        download: Influx.FieldType.INTEGER,
        upload: Influx.FieldType.INTEGER
      },
      tags: [
        'foo'
      ]
    }
  ]
});
const speedTest = require('speedtest-net');
const schedule = require('node-schedule');

console.log('ENV => DB_HOST', process.env.DB_HOST);
console.log('ENV => DB_PORT', process.env.DB_PORT);
console.log('ENV => DB_NAME', process.env.DB_NAME);

// run it every minute
// schedule.scheduleJob('* * * * *', () => {
//
// });

// run it every 10 seconds
setInterval(run, 10000);

function run() {
  const test = speedTest({maxTime: 5000});

  // console.log('Run speed test');

  test.on('data', data => {
    // console.dir(data);

    influx
      .writePoints([
        {
          measurement: 'speed_test',
          fields: {
            download: data.speeds.download,
            upload: data.speeds.upload
          },
          tags: {
            foo: 'bar'
          }
        }
      ])
      .then(() => {
        return influx.query(`
      select * from speed_test
      order by time desc
      limit 1
    `);
      })
      .then(rows => {
        rows.forEach(row => console.log(`Download: ${row.download} Upload: ${row.upload}`))
      })

  });

  // test.on('done', data => {
  //     console.log('done');
  //     console.dir(data);
  // });

  test.on('error', err => {
    console.error(err);
  });

}


