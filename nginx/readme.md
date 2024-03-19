# Nginx CORS

This project sets up an Nginx server as a reverse proxy to add `Access-Control-Allow-Origin: '*'` to all responses, resolving common CORS issues in frontend development.

## Usage

### Docker

Use the following Docker commands to run the server:

```bash
$ docker build -t nginx-proxy:latest .
$ docker run --rm -it -p 80:80 nginx-proxy:latest



To access locally, open your browser and enter either of the following URLs:

- [http://localhost/cors/https://trial.authlete.net/.well-known/openid-credential-issuer](http://localhost/cors/https://trial.authlete.net/.well-known/openid-credential-issuer)
- [http://localhost/cors/https://www.google.com/](http://localhost/cors/https://www.google.com/)
