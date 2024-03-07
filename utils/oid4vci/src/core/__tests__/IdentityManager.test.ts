import { identityStoreName } from '../../database/schema';
import { IdentityManager, StoreIdentityManager } from '../IdentityManager';
import { storage } from './fixtures';

describe('IdentityManager', () => {
  const identityManager: IdentityManager = new StoreIdentityManager(storage);

  afterEach(async () => {
    await storage.clear(identityStoreName);
  });

  it('should successfully initialize identity', async () => {
    let jwk = await identityManager.getJwkIdentity();
    expect(jwk).toBeUndefined();

    jwk = await identityManager.initializeJwkIdentity();
    expect(jwk).toBeDefined();
    expect(jwk.alg).toEqual('ES256');
  });

  it('should successfully retrieve identity', async () => {
    const jwkRef = {
      kty: 'EC',
      d: 'lPHtS-GHGLHoUUaRlJoIm920f0smWf1xN6fLgz7y3eA',
      crv: 'P-256',
      x: '6FHJYsI0by91XSllDSHMNS20Rlw6LrPNmPAR7jadeFs',
      y: 'gJiHCDP1jbAK_s5iItC7RtKV8Hx5RlLDoP_mEaWfe9w',
      alg: 'ES256',
    };

    await storage.insert(identityStoreName, {
      key: 'current',
      value: jwkRef,
    });

    let jwk = await identityManager.getJwkIdentity();
    expect(jwk).toEqual(jwkRef);

    jwk = await identityManager.initializeJwkIdentity();
    expect(jwk).toEqual(jwkRef);
  });
});
