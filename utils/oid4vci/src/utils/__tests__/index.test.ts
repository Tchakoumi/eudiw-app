import nock from 'nock';
import { composeUrl, fetchIntoDataUrl } from '../index';

describe('composeUrl', () => {
  it('should run as expected', () => {
    expect(composeUrl('https://server.example.com', '/path')).toEqual(
      'https://server.example.com/path'
    );

    expect(composeUrl('https://server.example.com/', '/path')).toEqual(
      'https://server.example.com/path'
    );

    expect(composeUrl('https://server.example.com/', 'path')).toEqual(
      'https://server.example.com/path'
    );

    expect(composeUrl('https://server.example.com', '?path')).toEqual(
      'https://server.example.com/?path'
    );
  });
});

describe('fetchBase64', () => {
  beforeAll(async () => {
    nock.disableNetConnect();
  });

  it('should fetch an image into base64 data', async () => {
    nock(/images/)
      .get(/icon/)
      .replyWithFile(200, __dirname + '/fixtures/icon.jpg', {
        'Content-Type': 'image/jpeg',
      });

    const data = await fetchIntoDataUrl('https://images.example.com/icon');

    expect(data).toEqual(
      'data:image/jpeg;base64,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'
    );
  });

  it('should throw on 404', async () => {
    nock(/images/)
      .get(/icon/)
      .reply(404);

    const promise = fetchIntoDataUrl('https://images.example.com/icon');
    await expect(promise).rejects.toThrow('404 Not Found');
  });
});
