# Backend

## Table of contents
1. [Overview](#overview)
2. [Getting started](#getting-started)
3. [Project structure](#project-structure)
4. [Web server and controllers](#web-server-and-controllers)
5. [Web sockets and ws gateways](#web-sockets-and-ws-gateways)
6. [Custom entrypoints](#custom-entrypoints)
7. [Databases](#databases)
8. [Error handling](#error-handling)
9. [Auth](#auth)

## Overview
Backend application. Features:
- Full code control
- Only important dependencies
- Production-ready
- JWT auth out of box
- Dependency injection
- Strong error system for API
- Fully wrote in TypeScript. Launched by `tsx` in runtime
  - ES modules support
  - Path alias support
- Standalone `Docker` app
- Dev mode with live-reload (in Docker too)
- Gateways (controllers) using classes and decorators
  - New gateways can be added by `@/lib/initializer`
- Database and entities are separated
- Custom web-server
  - Fast router (similar to Fastify)
  - Ability to use OR not use middlewares (CoR, events)
  - CORS support
  - Body parser
  - Simply and extendable context object with `req` and `res`
- Web-sockets
- No ORM for database, but flexible and well-typed query builder (`kysely`)
  - CLI migrations support 

## Getting started
1. nodejs:20.1 is needed. Recommended to use `pnpm`
2. Provide `.env` in root dir (like `.env.example`)
3. [If new project] Update info in `package.json`
4. [If new project] Update config in `@/infra/config/index.ts`

## Project structure
```
/scripts          # Custom scripts to run from CLI

/src
    /app          # App components. Domain logic & interfaces (controllers, websockets)
    /config       # Project configuration
    /entrypoints  # Web servers, websocket servers, etc.
    /databases    # DB connections
    /di           # Dependency injection
    /infra        # Infrastructure code
    /lib          # No-domain logic
    /utils        # Helpful functions
```

### Components in `/app`
Components are split with namespaces (like `users.auth` or `users.shared`). Content of each namespace is up to developer.

## Web server and controllers
Web server is fully self-wrote and available at `@/lib/web-server`. Routing is implemented as radix-tree, like it's done in `Fastify`.

Web server creates main object, called `Context`. Think about it as everything-in-one object. It contains native `req` and `res` (they are used to control request and response in controllers) and some helpful data.

To specify controller you should use `@Controller` decorator and `@Endpoint` decorator to mark methods as endpoint handlers. See examples at `@/app`. Types are available at `@/lib/web-server`.

You can add `chain` array for each `@Endpoint`. Think about it as a chain of functions. You can implement `CoR` or middlewares (not recommended) here. For other stuff like loggers and error handlers you can use `web server hooks`.

Web server has some hooks to perform actions:
- `onError`. Triggered on request error. Default error handler is available at `@/entrypoints/web-servers/shared/error-handler.ts`. Catches all errors from app, see more in [Error handling](#error-handling) section.
- `onRequest`. Triggered when new request received
- `onRequestFinished`. Triggered when request is finished (when `req` emits `finish` event). Triggered if error thrown as well

Pre-flight requests (for CORS) are handled out-of-box.

### Example

```typescript
@Controller('accounts')
class AccountsController {
  
  @Endpoint('POST', '/')
  async createAccount(ctx: Context) {
    // ...
    ctx.res.end();
  }
}

const accountsController = new AccountsController();
const webServer = new WebServer([accountsController], {
  port: 3000,
  prefix: '/api',
});

webServer.onError(webServerErrorHandler);
webServer.start();
```

## Web sockets and ws gateways
Works similar to web servers. Based on `ws` package, available at `@/lib/web-sockets`. Based on rooms, like it's done in `SocketIO`.

Uses `Context` object with `ws` (WebSocket instance) field.

Alongside with server it gives you `WsEmitter` to emit events to rooms. See at `@/lib/entrypoints/web-sockets`.

To specify gateway you should use `@WsGateway` decorator and `@WsHandler` decorator to mark methods as handlers. Types are available at `@/lib/web-sockets`.

You can add `chain` array for each `@WsGateway` as well.

Web sockets has similar hooks to perform actions:
- `onError`. Triggered on request error. No default error handler provided. Catches all errors from app, see more in [Error handling](#error-handling) section.
- `onEvent`. Triggered when new event request received
- `onEventFinished`. Triggered when event request is finished (when handler function is finished). Triggered if error thrown as well

### Example
```typescript
@WsGateway()
class AccountsWsGateway {

  @WsHandler('user:message')
  async processMessage(ctx: Context) {
    // ...
  }
}

const accountWsGateway = new AccountsWsGateway();
const wsServer = new WsServer([accountWsGateway], {
  port: 3001,
});
wsServer.start();
```

## Custom entrypoints
You can implement your own entrypoint in such style. Just take look at `@/lib/initializer` and how it used.

## Databases
`Kysely` is a great query builder with strong types. You can use it with many SQL databases.

To access data you should write your own `repository`. Important thing - there is no ORM, so you should map data with entities by yourself. For example, in `@/app/users/shared` repository getting data from DB and mapping entities on place.

There is also provided CLI in `/scripts` directory to make and run migrations.

## Error handling
Be careful with error handling. It's important to keep clean responses from your API. They are all handled out-of-box by default web server error handler, but can be handled literally by everything. There are some error types:
- `AppError`. Custom error of your application. Created by creating new error class extended from `AppError` class. Used ONLY on `app` layer.
- `ValidationError`. Error from `zod` validator. Used ONLY on `entrypoints`.
- `ApiError` (web server specific). Custom API error to specify error codes like 401 or 403. Used ONLY on `entrypoints`.
- `UnknownError`. Unhandled error type without automatic convert. Used ONLY by error handlers.

## Auth
JWT out-of-box auth provided. See `@/app/users/auth`.

Access and refresh tokens are stored in cookies. You can set settings for JWT in `.env` and `@/config`.