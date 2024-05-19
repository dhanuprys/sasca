FROM node:20.10.0

WORKDIR /app

RUN apt update && apt install supervisor libpq-dev g++ make iputils-ping nano -y

COPY supervisord.conf /etc/supervisord.conf

WORKDIR /app/frontend

COPY ./frontend .

# BUILD FRONTEND
RUN npm ci && npm run build
RUN rm -rf src

WORKDIR /app/backend

COPY ./backend .

# BUILD BACKEND
RUN npm ci --loglevel=error && npm rebuild @tensorflow/tfjs-node build-addon-from-source && npm run build
RUN rm -rf src

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]