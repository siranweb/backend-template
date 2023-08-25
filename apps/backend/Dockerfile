FROM node:18.17.1

WORKDIR app/

RUN npm install -g pnpm

ADD package.json .

RUN pnpm i

ADD . .

EXPOSE 4000
EXPOSE 4001

CMD pnpm run start:memory