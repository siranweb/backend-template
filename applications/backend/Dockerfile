FROM node:lts-alpine3.17

WORKDIR app/

RUN npm install -g pnpm

ADD package.json .
ADD pnpm-lock.yaml .

RUN pnpm i

ADD . .

EXPOSE 4000
EXPOSE 4001

CMD pnpm run build && pnpm run start