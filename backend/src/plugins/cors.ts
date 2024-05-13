import fp from 'fastify-plugin';

export default fp(async function (fastify) {
  // fastify.addHook('onSend', async (request, reply) => {
  //   const corsWhiteList = [
  //     'http://localhost:3000',
  //     'https://stemsi.cloud',
  //     'https://beta.smkn3singaraja.sch.id',
  //     'https://smkn3singaraja.sch.id'
  //   ];

  //   if (corsWhiteList.includes(request.headers.origin!)) {
  //     reply.headers({
  //       'access-control-allow-origin': request.headers.origin,
  //       'access-control-allow-credentials': 'true',
  //       'access-control-allow-methods': 'POST, GET, PUT, PATCH, DELETE',
  //       'access-control-allow-headers': 'content-type, accept-encoding'
  //     })
  //   }
  // })
});