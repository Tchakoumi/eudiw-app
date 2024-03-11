import { StorageFactory } from '@datev/storage';
import {
  OID4VCIServiceDBSchema,
  credentialStoreName,
  dbName,
  dbVersion,
  identityStoreName,
} from './schema';

export class DBConnection {
  private static storage: StorageFactory<OID4VCIServiceDBSchema>;

  static getStorage() {
    if (!DBConnection.storage) {
      DBConnection.storage = new StorageFactory<OID4VCIServiceDBSchema>(
        dbName,
        dbVersion,
        {
          upgrade(db) {
            db.createObjectStore(credentialStoreName, {
              keyPath: 'display.id',
              autoIncrement: true,
            });

            db.createObjectStore(identityStoreName);
          },
        }
      );
    }

    return DBConnection.storage;
  }
}
