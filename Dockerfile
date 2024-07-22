FROM node:20.10.0

WORKDIR /app

RUN apt update && apt install supervisor libpq-dev g++ make iputils-ping nano wget \
    libnss3-dev libgdk-pixbuf2.0-dev libgtk-3-dev libxss-dev install libasound2 -y
RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb \
    && apt -y install ./google-chrome-stable_current_amd64.deb

COPY supervisord.conf /etc/supervisord.conf

WORKDIR /app/frontend

COPY ./frontend .

# BUILD FRONTEND
RUN npm ci && npm run build
# RUN rm -rf src

WORKDIR /app/backend

COPY ./backend .

# BUILD BACKEND
RUN npm ci --loglevel=error && npm rebuild @tensorflow/tfjs-node build-addon-from-source && npm run build
# RUN rm -rf src

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]