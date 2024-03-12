import express, { Request, Response } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

// Listen on a specific port via the PORT environment variable
const port = process.env.PROXY_SERVER_PORT
  ? Number(process.env.PROXY_SERVER_PORT)
  : 3010;

// Create an Express application
const app = express();

// Relax CORS restrictions
const setCorsHeaders = (res: Response) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
};

// Proxy all requests
app.use((req, res, next) => {
  // Enable Cross-Origin Resource Sharing (CORS)
  setCorsHeaders(res);

  // The new target is assumed to be the full path
  // of the current request.
  let target: URL;

  try {
    target = new URL(req.originalUrl.substring(1));
  } catch (e) {
    // The new target must be a compliant URL
    res.status(400).send('Invalid URL');
    return;
  }

  const proxy = createProxyMiddleware({
    changeOrigin: true,
    target: target.origin,
    pathRewrite: () => target.href.substring(target.origin.length),
    onProxyRes: (proxyRes) => {
      delete proxyRes.headers['set-cookie'];
    },
  });

  // Proxy the request
  proxy(req, res, next);
});

// Lazy error handler
app.use((err: Error, req: Request, res: Response) => {
  console.error(err);
  res.status(500).send(err.message);
});

// Start the Express server on the specified port
app.listen(port, () => {
  console.log(`[proxy-server] running on port ${port}`);
});
