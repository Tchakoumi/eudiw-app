# Nginx CORS Proxy

This project provides a solution to common CORS issues encountered in frontend development by setting up an Nginx server as a reverse proxy. It adds `Access-Control-Allow-Origin: '*'` to all responses, allowing cross-origin requests.

## Usage

### Docker

You can run the server using Docker. Here are the commands you need:

1. Build the Docker image:

```bash
$ docker build -t nginx-proxy:latest .
```

Alternatively, you can pull the image from the repository:
```bash
$ docker pull ghcr.io/adorsys/nginx-proxy:latest
```
Run the Docker image:
```bash
$ $ docker run --rm -it -p 80:80 nginx-proxy:latest
```
### Accessing the Server

Once the server is running, you can access it by entering one of the following URLs into your browser:
- https://proxy.solutions.adorsys.com
- https://proxy.solutions.adorsys.com/cors/https://jsonplaceholder.typicode.com/todos
- https://proxy.solutions.adorsys.com/cors/https://trial.authlete.net/.well-known/openid-credential-issuer