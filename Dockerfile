# syntax=docker/dockerfile:1
# parts based on https://pnpm.io/cli/fetch and https://hub.docker.com/r/tiangolo/uwsgi-nginx-flask/, 4/17/23

FROM node:16
WORKDIR /build

RUN npm install -g pnpm
COPY ./labeling-app-frontend/pnpm-lock.yaml /build
RUN pnpm fetch

COPY ./labeling-app-frontend /build
RUN pnpm install -r --offline
RUN npm run build

FROM tiangolo/uwsgi-nginx-flask:python3.11
ENV STATIC_INDEX 1

ADD https://sqlite.org/2023/sqlite-autoconf-3410200.tar.gz /
RUN tar -xvzf /sqlite-autoconf-3410200.tar.gz && cd sqlite-autoconf-3410200 && ./configure && make && make install && cd /app 
ENV LD_LIBRARY_PATH /usr/local/lib

COPY ./labeling-app-backend/requirements.txt /app
RUN pip install --no-cache-dir --upgrade -r /app/requirements.txt

COPY ./labeling-app-backend /app

COPY --from=0 /build/dist /app/static

RUN python init-db.py