import { FastifyReply } from "fastify";
import { FastifyCustomRequestScheme, FastifyExtendedInstance, JWTUserPayload } from "../blueprint";

interface IStorageOptions {
    // in MB
    maxSizeMB?: number;
    namespace?: string;
}

function createStorageHandler(fastify: FastifyExtendedInstance, options: IStorageOptions) {
    return async function (
        request: FastifyCustomRequestScheme,
        reply: FastifyReply
    ) {
        const user = request.user as unknown as JWTUserPayload;
        let result;
        let output;

        const uploadedFile = await request.file({
            limits: {
                fileSize: (options.maxSizeMB || 2) * 1000000
            }
        });

        if (!uploadedFile) {
            return reply.code(400).send('Bad request');
        }

        result = (await fastify.storage.create<typeof uploadedFile.file>(
            uploadedFile.filename, 
            uploadedFile.file, 
            options.namespace || '',
            uploadedFile.mimetype
        ) as any);

        if (user.role === 'admin') {
            output = result;
        } else {
            output = {
                id: result.id
            }
        }

        return [
            output
        ];

    }
}

export default createStorageHandler;