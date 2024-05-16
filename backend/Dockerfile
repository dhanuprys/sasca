FROM node:20.10.0

WORKDIR /app

RUN apt update && apt install supervisor libpq-dev g++ make -y iputils-ping nano

COPY . .
COPY supervisord.conf /etc/supervisord.conf

RUN npm ci --loglevel=error && npm rebuild @tensorflow/tfjs-node build-addon-from-source && npm run build
RUN rm -rf ./src

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]