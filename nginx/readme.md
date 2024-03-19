
# Nginx CORS.

This project sets up an Nginx server as a reverse proxy to add `Access-Control-Allow-Origin: '*'` to all responses, resolving common CORS issues in frontend development.

Use the Docker command below to run the server:

```
$ docker build -t nginx-proxy:latest .

```

```
$ docker run --rm -it -p 80:80 nginx-proxy:latest
```
```

#Locally

Open the browser and type :

http://localhost/cors/https://trial.authlete.net/.well-known/openid-credential-issuer

or http://localhost/cors/https://www.google.com/