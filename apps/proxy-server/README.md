# proxy-server

This proxy server bypasses CORS-related issues in a browser context
by setting necessary origin headers in the middle.

To proxy a URL through this server, simply append the URL to the
server's location.

`<proxy-server-location>/<fully-qualified-URL>`

For example, if the server is hosted at `http://localhost:3010`,
you can proxy `https://api.ipify.org` by requesting:

`http://localhost:3010/https://api.ipify.org`

Wondering if all HTTP methods will work? They will. There are no known
restrictions to disclose.
