FROM node:20.10.0

WORKDIR /app

RUN apt update && apt install iputils-ping nano -y

COPY . .

RUN npm ci && npm run build
RUN rm -rf src

CMD ["npm", "run", "start"]