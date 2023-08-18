FROM node:18.17.1

WORKDIR app/

# TODO Multistage build?
RUN npm install -g pnpm

ADD package.json .
ADD tsconfig.json .

RUN pnpm i

# TODO ADD . .
ADD src/ ./src/

EXPOSE 4000
EXPOSE 4001

CMD pnpm run start:memory