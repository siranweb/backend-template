# 🚧 CURRENTLY IN DEVELOPMENT! 🚧

Not ready to use. Check out plans and what was done for now below

## Overview

### Platform (NodeJS)

All template based on NodeJS as universal tool for JavaScript/TypeScript developers. All commands are described in the package.json scripts.

### Package manager (pnpm)

For this project [pnpm](https://pnpm.io/) was picked. You can check advantages and why it's better than npm or yarn [here](https://refine.dev/blog/pnpm-vs-npm-and-yarn/#advantages-of-pnpm).

### Repository organization

This template was build as [monorepo](https://en.wikipedia.org/wiki/Monorepo). It means that you can control all your applications and their dependencies from one place. However, you can still use every app independently. There are available ready-to-use backend and frontend applications.

## Backend

### Philosophy 

There are a few goals I had in mind during development of this part.

1. **Flexibility**. I don't really like when people separating their template's code into different packages. This a problem because sometimes my vision is different from others, so I want to change something - I need to fork package. I decided to simplify this process, so all infrastructure part is available right in template directory.
2. **Best practices**. A very common mistake I see in projects - poor layer separation. It's really hard to reuse some application logic, and sometimes there's literally no way to write tests. I solved this problem by layer separation, interfaces and dependency injection. This is not a single case. Actually, I tried to implement simplified version of [Clean Architecture](https://lbhackney-it.github.io/API-Playbook/clean_architecture/), so you will notice some similar practices. Anyway, you still can rewrite it (as any other project's part) as you want.
3. **KISS**. I'm not a fan of complex solutions. I'm not trying to create new framework, just a template for the most needed features, that I write from zero project by project. It includes things like controllers boilerplate, error handling, Docker containerization and some more.

### Primary tech stack

- Platform: NodeJS
- Language: TypeScript with tsc and [tsx](https://github.com/esbuild-kit/tsx) (TypeScript Execute)
- Web server: [koa](https://koajs.com/)
- Sockets: [socketIO](https://socket.io/)
- Database: PostgreSQL with [kysely](https://github.com/kysely-org/kysely) (SQL query builder)
- Logs: [winston](https://github.com/winstonjs/winston), [chalk](https://github.com/chalk/chalk)
- Validation: [zod](https://github.com/colinhacks/zod)
- Other: [eslint](https://github.com/eslint/eslint), [prettier](https://github.com/prettier/prettier)

### TypeScript configuration

There are two options to run TS:

- Build by tsc. You need to run `make:build` and `start:build` script from package.
- Execute by [tsx](https://github.com/esbuild-kit/tsx). You need to run `start:memory` (or `start:dev:memory`) with watch flag.

A few things you should know:

- TypeScript module system compiles to ES Modules, not legacy CommonJS. It's needed to support all modern packages (like chalk v5). Packages with CommonJS module system are working too. 
- TypeScript configurated to work with aliases (like `@/application/user/...`). This behavior already handled by package scripts (see above).
- TypeScript is also configurated to work with legacy decorators (see known issues).

#### Why not [ts-node](https://github.com/TypeStrong/ts-node)?

There were issues to make it work with aliases and ES Modules. Tsx already handling all this stuff out-of-box, so I chose it. As a nice addition, it's pretty fast.

### Entities

TBD

### Database (Repositories)

TBD

### Actions

TBD

### Web server & controllers

TBD

### Sockets

TBD

### Error handling

TBD

### Validation

TBD

### Dependency Injection (DI)

TBD


## Frontend

TBD

## Known issues

TBD

- legacy decorators

## FAQ

### Can I use other programming languages except JS/TS?

Sure, you can do it. You can use any others programming languages for your apps; it's not a restriction that template is based on NodeJS. Just prepare package.json scripts if you need or write your own bash scripts.
