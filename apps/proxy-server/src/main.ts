import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

// Listen on a specific port via the PORT environment variable
const port = process.env.PROXY_SERVER_PORT
  ? Number(process.env.PROXY_SERVER_PORT)
  : 3010;

// Create an Express application
const app = express();

// Proxy all requests to URL-assumed path
app.use(
  createProxyMiddleware({
    router: (req) => new URL(req.path.substring(1)),
    pathRewrite: (path) => new URL(path.substring(1)).pathname,
    changeOrigin: true,
    onProxyRes: (proxyRes) => {
      // Enable Cross-Origin Resource Sharing (CORS)
      proxyRes.headers['access-control-allow-origin'] = '*';
      proxyRes.headers['access-control-allow-headers'] = '*';
      delete proxyRes.headers['set-cookie'];
    },
  })
);

// Start the Express server on the specified port
app.listen(port, () => {
  console.log(`proxy server is running on port ${port}`);
});
