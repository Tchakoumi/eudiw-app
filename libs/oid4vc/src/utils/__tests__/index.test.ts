import { composeUrl } from '../index';

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
