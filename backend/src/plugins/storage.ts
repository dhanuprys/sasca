import fp from 'fastify-plugin';
import path from 'path';
import fs from 'fs-extra';
import knexDB from '../utils/db';
import * as nano from 'nanoid';
import { ReadStream } from 'fs';
import mime from 'mime-types';

interface FileProperty {
  id: string;
  real_name: string;
  path: string;
  mime: string;
  used: boolean;
  deleted: boolean;
}

export class ApplicationStorage {
  constructor(protected basePath: string) {
    // ...
  }

  private getFileExtension(fileName: string) {
    const splittedName = fileName.split('.');

    if (splittedName.length <= 1) {
      return false;
    }

    return splittedName[splittedName.length - 1];
  }

  create<T = ReadStream>(
    fileName: string,
    content: T,
    namespace: string = '',
    mimeType: string = '',
    publicAccess: boolean = true
  ) {
    return new Promise(async (resolve, reject) => {
      let fileProperties = null;
      const fileNameId = nano.nanoid();
      const fileExtension = this.getFileExtension(fileName);
      const namespacedFilename = path.join(namespace, fileNameId) + (fileExtension ? '.' + fileExtension : '');
      const absolutePath = path.join(this.basePath, publicAccess ? 'public' : '', namespacedFilename);

      !fileName && (fileName = fileNameId);

      await knexDB.transaction(async () => {
        // openpath
        await fs.outputFile(absolutePath, '');
        const writeTarget = fs.createWriteStream(absolutePath);

        (content as ReadStream).on('data', (chunk) => {
          writeTarget.write(chunk);
        });

        (content as ReadStream).on('end', async () => {
          fileProperties = (await knexDB('service.storage')
            .insert({
              real_name: fileName,
              path: namespacedFilename,
              mime: mimeType
            }, ['id', 'path']))[0];

          resolve(fileProperties);
        });

        (content as ReadStream).on('error', (error) => {
          reject(error);
        })
      });
    });
  }

  isExists() {
    // ...
    throw new Error('Not implemented.');
  }

  async use(fileId: string): Promise<null | FileProperty> {
    try {
      const fileProperties = await knexDB('service.storage')
        .where({ id: fileId })
        .update({ used: true }, ['*']);

      if (fileProperties.length <= 0) {
        return null;
      }

      return fileProperties[0];
    } catch (error) {
      return null;
    }
  }

  async delete(fileName: string) {
    let deleteStatus = null;

    await knexDB.transaction(async () => {
      // Menhapus file
      await fs.unlink(
        path.join(
          this.basePath,
          fileName
        )
      );

      // Memperbarui database
      deleteStatus = await knexDB('service.storage')
        .where({ path: fileName })
        .update({ deleted: true });
    });

    return deleteStatus;
  }
}

export default fp(async function (fastify) {
  const STORAGE_BASEPATH = process.env.STORAGE_PATH || './static';
  const storageDriver = new ApplicationStorage(STORAGE_BASEPATH);

  fastify.decorate(
    'STORAGE_BASEPATH',
    STORAGE_BASEPATH
  );

  fastify.decorate(
    'storage',
    storageDriver
  )
});