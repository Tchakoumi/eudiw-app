import { StorageMethodType } from '../Storage.types';
import { DBSchema } from 'idb';

/**
 * Define the wrapper method for storage error handling
 *
 * @param methodName Name of the current method in context
 * @param originalMethod Method of the `StorageFactory` class
 */
export function storageErrorHandler<T extends DBSchema>(
  methodName: string,
  originalMethod: (
    ...agrs: Parameters<StorageMethodType<T>>
  ) => ReturnType<StorageMethodType<T>>
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return async function (this: any, ...args: Parameters<StorageMethodType<T>>) {
    try {
      return await originalMethod.apply(this, args);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(`Error occurred in method <${methodName}>`);
      throw new StorageError(error.message);
    }
  };
}

/**
 * Storage module Error class
 */
class StorageError extends Error {
  constructor(message: string) {
    super(`StorageError: ${message}`);
    this.name = `StorageError`;
    console.log(`StorageError:`, message);
  }
}
