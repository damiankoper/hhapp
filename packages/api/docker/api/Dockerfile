FROM node:lts-alpine

RUN apk add --no-cache git postgresql-client && \
    npm install -g npm && \
    npm install -g typeorm

WORKDIR /app