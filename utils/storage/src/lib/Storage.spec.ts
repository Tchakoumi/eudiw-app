import { StorageFactory } from './StorageFactory';

// Mocking indexdedDB functionality
import 'fake-indexeddb/auto';

describe('StorageFactory', () => {
  const storageFactory = new StorageFactory('test_db', 1);

  it('should work', async () => {
    await storageFactory.init();
  })
});
