import Queue from 'bull';

function createJob<T, K = any>(
    instanceId: string,
    processor: Queue.ProcessCallbackFunction<T>,
    model?: (instance: Queue.Queue) => K
) {
    const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1';
    const REDIS_PORT = process.env.REDIS_PORT || 6379;

    console.log(REDIS_HOST, REDIS_PORT);

    const instance = new Queue(
        instanceId,
        {
            redis: {
                host: REDIS_HOST,
                port: REDIS_PORT as number
            }
        }
    );

    return {
        instance,
        processor,
        model: model ? model(instance) : undefined
    }
}

export default createJob;