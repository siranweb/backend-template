# WIP

## TODO

* [ ] Написать README
* [ ] api -> users -> schemas разделить на файлы
* [ ] Конфиг на название проекта и переиспользовать
* [ ] Исправить тудушки
* [ ] primary-database -> app-database
* [ ] Функционал для миграций

## Проблемы
* Запуск миграций
* Ограничения tsx

# Backend App Template
This is template information page. If you are looking for startup page - check [START.md](START.md)

## New project checklist
* [ ] Update naming in config `app/infrastructure/config/index.ts`
* [ ] Update naming in `package.json` and `package-lock.json`
* [ ] Update naming in `docker-compose.yml` and `docker-compose-dev.yml`
* [ ] Update `START.md`
* [ ] Delete `README.md` and rename `START.md` to `README.md`

## Primary tech stack
* Web server: h3, zod, swagger
* Scheduler: cron
* Database: kysely, pg
* Logs: pino
* DI: awilix
* Bootstrap: tsx
* Package manager: pnpm
* Git hooks: husky
* Code style: eslint, prettier

## Features
* Controllers are specified with decorators, similar to `NestJS`, but without metadata. See [example controller](app/api/example/controller.ts)
  * Also, there are no middlewares. Chain of responsibility pattern and hooks are used instead.
  See [auth handler](app/infrastructure/web-server/chain-handlers/auth.ts)
  * Error handler provided too
* Auto generated swagger using decorators and zod schemas
* Implemented loggers with transient context. For example, each request provides `requestId` (see [request storage](app/infrastructure/request-storage))
and you can filter logs for whole request flow with other layers
* Authorization already implemented with JWT refresh/access tokens in cookies
* All dependencies are provided with interfaces. Also, IoC-container pattern used with Awilix package
* No ORMs for database. Entities are part of the domain, and repositories just a way to store these entities
  * However, some QoL things are used. `Kysely` provides case converter plugin (snake_case <-> camelCase),
  so database repositories are also maps rows columns to entities fields and vice versa.
* Scheduler provided as well
* `tsx` compiler is used. No `dist` directories, only runtime launching
* Custom migrator with plain SQL migrations