import Fastify from 'fastify'
import Autoload from '@fastify/autoload';
import path from 'path';
import { FastifyExtendedInstance } from './blueprint';
import makeRank from './daemon/cron/executors/makeRank';

const SERVICE_MODE = process.env.SERVICE_MODE

if (
    SERVICE_MODE !== 'ALL'
    && SERVICE_MODE !== 'BE'
) {
    console.error('Backend inactive');
    while (true) { /* SUSPEND PROCESS */ }
}

// face-api.js speed boost
require('@tensorflow/tfjs-node');

async function main() {
  const fastify: FastifyExtendedInstance = Fastify({ logger: true }) as unknown as FastifyExtendedInstance;

  console.log('Loading ENV');
  require('dotenv').config({ path: ['.env.local', '.env'] });

  fastify.register(Autoload, {
    dir: path.join(__dirname, 'plugins')
  });

  fastify.register(Autoload, {
    dir: path.join(__dirname, 'routes'),
    dirNameRoutePrefix: function rewrite (_, folderName) {
      // Melakukan rewrite file dari p_ menjadi :
      // Hal ini disebabkan karena linux kebanyakan tidak mendukung
      // colon (:) sebagai nama file
      return folderName.replace('p_', ':');
    }
  });

  fastify.options('/*', (request, reply) => {
    return reply.send('');
  })

  fastify.listen({ port: 8020, host: '0.0.0.0' }, (err, address) => {
    makeRank();

    if (err) {
      console.error(err)
      process.exit(1)
    }

    console.log(`fastify listening at ${address}`)
  })
}

main();