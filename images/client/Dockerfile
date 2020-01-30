## ---- Staged Build: Builder ---- ##

FROM node:10-alpine as deps-builder
LABEL name ihaq-client-install

WORKDIR /ihaq-client
# Install app dependencies
COPY ./package.json ./yarn.lock ./
RUN yarn install 


## ---- Staged Build: frontend ---- ##

FROM deps-builder as builder
LABEL name ihaq-client-build

WORKDIR /ihaq-client
COPY . .
RUN yarn run build

## ---- Staged Build: frontend ---- ##
FROM nginx:alpine

WORKDIR /ihaq-client

# Nginx config
RUN rm -rf /etc/nginx/conf.d
COPY nginx.conf /etc/nginx
COPY run.sh run.sh

LABEL name ihaq-client
COPY --from=builder /ihaq-client/build  /var/www
COPY --from=builder /ihaq-client/run.sh  run.sh

RUN chmod +x run.sh

# Add bash
RUN apk add --no-cache bash

EXPOSE 80

ENTRYPOINT ["/ihaq-client/run.sh"]