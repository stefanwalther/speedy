const Influx = require('influx');

const settings = {
  INTERVAL: process.env.INTERVAL || '* * * * *',
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_NAME: process.env.DB_NAME,
  MAX_TIME: process.env.MAX_TIME || 5000

};

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
        'interval'
      ]
    }
  ]
});
const speedTest = require('speedtest-net');
const schedule = require('node-schedule');

console.log('ENV => DB_HOST ==>', settings.DB_HOST);
console.log('ENV => DB_PORT ==>', settings.DB_PORT);
console.log('ENV => DB_NAME ==>', settings.DB_NAME);
console.log('ENV => INTERVAL ==>', settings.INTERVAL);
console.log('ENV => MAX_TIME ==>', settings.MAX_TIME);

// run it every minute
schedule.scheduleJob('* * * * *', () => {
  run();
});

// run it every 10 seconds
// setInterval(run, 10000);

function run() {
  const test = speedTest({maxTime: settings.MAX_TIME});

  // console.log('Run speed test');

  test.on('data', data => {
    // console.dir(data);

    influx.getDatabaseNames()
      .then(names => {
        if (!names.includes(process.env.DB_NAME)) {
          return influx.createDatabase(process.env.DB_NAME)
        }
      })
      .then(() => {
        influx
          .writePoints([
            {
              measurement: 'speed_test',
              fields: {
                download: data.speeds.download,
                upload: data.speeds.upload
              },
              tags: {
                interval: settings.INTERVAL
              }
            }
          ])
          //Todo: Remove, just for debugging purposes
          .then(() => {
            return influx.query(`
              select * from speed_test
              order by time desc
              limit 1
            `);
          })
          .then(rows => {
            rows.forEach(row => console.log(`Download: ${row.download} Upload: ${row.upload}`));
            rows.forEach(row => console.log(row));
          })
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


