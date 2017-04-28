
## Configuration

Environment variable to set the configuration of speedy:

- `DB_HOST` - InfluxDB host
- `DB_PORT` - InfluxDB port
- `DB_NAME` - InfluxDB database name
- `INTERVAL` - Defines how often the job should run; see cron-jobs for more details (defaults to ```* * * * *```, which equals to run the job every minute)
- `MAX_TIME` - Max timeout for the speed-test (defaults to `5000`)

