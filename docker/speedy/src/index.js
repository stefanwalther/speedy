const Influx = require('influx');
const speedTest = require('speedtest-net');
const schedule = require('node-schedule');
const convertHrtime = require('convert-hrtime');

const settings = {
  INTERVAL: process.env.INTERVAL || '* * * * *',
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.INFLUXDB_HTTP_BIND_ADDRESS || 8086,
  DB_NAME: process.env.INFLUXDB_DB,
  MAX_TIME: process.env.MAX_TIME || 5000
};

const influx = new Influx.InfluxDB({
  host: settings.DB_HOST,
  database: settings.DB_NAME,
  schema: [
    {
      measurement: 'speed_test',
      fields: {
        download: Influx.FieldType.INTEGER,
        upload: Influx.FieldType.INTEGER,
        originalUpload: Influx.FieldType.INTEGER,
        originalDownload: Influx.FieldType.INTEGER,
        executionTime: Influx.FieldType.FLOAT
      },
      tags: [
        'interval',
        'isp',
        'host'
      ]
    }
  ]
});

console.log('Settings', settings);

// run it every minute
schedule.scheduleJob(settings.INTERVAL, () => {
  runSpeedTest();
});

// Just for debugging purposes
// run it every 10 seconds
// setInterval(run, 10000);

function runSpeedTest() {
  let t = process.hrtime();
  const test = speedTest({maxTime: settings.MAX_TIME});

  test.on('data', data => {
    // console.dir(data);

    influx.getDatabaseNames()
      .then(names => {
        if (!names.includes(settings.DB_NAME)) {
          return influx.createDatabase(settings.DB_NAME);
        }
      })
      .then(() => {
        let t1 = process.hrtime(t);
        influx
          .writePoints([
            {
              measurement: 'speed_test',
              fields: {
                download: data.speeds.download,
                upload: data.speeds.upload,
                originalUpload: data.speeds.originalUpload,
                originalDownload: data.speeds.originalDownload,
                executionTime: convertHrtime(t1).s
              },
              tags: {
                interval: settings.INTERVAL,
                isp: data.client.isp,
                host: data.server.host
              }
            }
          ])
          // Todo: Remove, just for debugging purposes
          .then(() => {
            return influx.query(`
              select * from speed_test
              order by time desc
              limit 1
            `);
          })
          .then(rows => {
            rows.forEach(row => console.log({Download: row.download, Upload: row.upload, ExecutionTime: row.executionTime}));
            // Log the entire entry (for debugging purposes)
            // rows.forEach(row => console.log(row));
          });
      });

  });

  // test.on('done', data => {
  //     console.log('done');
  //     console.dir(data);
  // });

  test.on('error', err => {
    console.error('An error occurred performing the test', err);
  });

}

