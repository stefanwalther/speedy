# speedy

> Test, track, monitor and analyze your internet speed.

NOTE: NOT READY TO BE USED, YET.
STILL UNDER DEVELOPMENT.

A very simplistic solution to track, monitor & analyze your internet speed & bandwidth.

## Installation

Fork the repository:

```sh
$ git clone https://github.com/stefanwalther/speedy
```

Then run from the root directory:
```sh
$ docker-compose -d up
```

This will essentially spin up three containers:

* speedy - Small node.js service to run a speed-test periodically (based on [speedtest-net](https://github.com/ddsol/speedtest.net).
* InfluxDB - Time series database to store the results from speedy, based on [InfluxDB](https://github.com/influxdata/influxdb).
* Grafana - Pre-Configured [Grafana](https://github.com/grafana/grafana) instance to visualize the results.

## Developing

Run the development environment:

```sh
$ yarn dc-dev-up
```

The development differs as follows from the example above:

* Containers are build on demand (from the Dockerfiles)
* You can work on the source code in `./docker/speedy/src` and the solution will automatically get updated (using nodemon).

## About

### Author

**Stefan Walther**

* [github/stefanwalther](https://github.com/stefanwalther)
* [twitter/waltherstefan](http://twitter.com/waltherstefan)

### License

MIT