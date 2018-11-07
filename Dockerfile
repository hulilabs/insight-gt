FROM nginx:alpine

RUN apk add --update curl && rm -rf /var/cache/apk/*

HEALTHCHECK --interval=30s --retries=3 --timeout=5s \
    CMD curl --fail http://localhost || exit 1

RUN rm -rf /etc/nginx/conf.d/

COPY ./nginx/vhost/ /etc/nginx/conf.d/
COPY ./src /srv/web-components
