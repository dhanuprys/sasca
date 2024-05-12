import Fastify from 'fastify'
import Autoload from '@fastify/autoload';
import path from 'path';
import { FastifyExtendedInstance } from './blueprint';

async function main() {
  const fastify: FastifyExtendedInstance = Fastify() as unknown as FastifyExtendedInstance

  require('dotenv').config()

  fastify.register(Autoload, {
    dir: path.join(__dirname, 'plugins')
  });

  fastify.register(Autoload, {
    dir: path.join(__dirname, 'routes'),
    dirNameRoutePrefix: function rewrite (folderParent, folderName) {
      // Melakukan rewrite file dari p_ menjadi :
      // Hal ini disebabkan karena linux kebanyakan tidak mendukung
      // colon (:) sebagai nama file
      return folderName.replace('p_', ':');
    }
  });

  fastify.options('/*', (request, reply) => {
    console.log('options called')
    return reply.send('')
  })

  fastify.listen({ port: 8080, host: '0.0.0.0' }, (err, address) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    console.log(`fastify listening at ${address}`)
  })
}

main();