import fp from 'fastify-plugin';

export default fp(async function (fastify) {
  const yupOptions = {
    strict: false,
    abortEarly: false, // return all errors
    stripUnknown: true, // remove additional properties
    recursive: true
  }

  // @ts-ignore
  fastify.setValidatorCompiler(({ schema, method, url, httpPart }) => {
    return function (data) {
      // with option strict = false, yup `validateSync` function returns the
      // coerced value if validation was successful, or throws if validation failed
      try {
        // @ts-ignore
        const result = schema.validateSync(data, yupOptions)
        return { value: result }
      } catch (e) {
        return { error: e }
      }
    }
  })
});