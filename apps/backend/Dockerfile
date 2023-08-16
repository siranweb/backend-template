FROM node:18.17.1

WORKDIR app/
RUN pwd

ADD src/ ./src/
ADD package.json .
ADD tsconfig.json .
ADD .env .

RUN npm install -g pnpm
RUN pnpm i

EXPOSE 4000
EXPOSE 4001

CMD pnpm run start:memory