# Speedy

## About

Tiny node.js service to measure the internet download/upload speed at a given interval and save it to InfluxDb.

## Configuration

Environment variable to set the configuration of speedy:

- `SPEEDY_DB_HOST` - InfluxDB host
- `SPEEDY_DB_NAME` - InfluxDB database name
- `SPEEDY_DB_PORT` - InfluxDB port
- `SPEEDY_INTERVAL` - Defines how often the job should run; see cron-jobs for more details (defaults to `* * * * *`, which equals to run the job every minute; see below)
- `SPEEDY_MAX_TIME` - Max timeout for the speed-test (defaults to `5000`)

### SPEEDY_INTERVAL

The interval is defined by using the cronjob syntax.

- `* * * * *` - every minute
- `*/5 * * * *` - every 5 minutes
- `0 * * * *` - every hour
- ...


Hint: Use this great online editor to get the desired value: [https://crontab.guru/](https://crontab.guru/)