FROM influxdb:1.2.0-alpine
MAINTAINER Stefan Walther <swrnixda@gmail.com>

WORKDIR /app
COPY entrypoint.sh ./
RUN chmod u+x entrypoint.sh

ENTRYPOINT ["/app/entrypoint.sh"]