# Backend

## Overview
Backend application. Some info:
- Full code control
- Only important dependencies
- Production-ready
- JWT auth out of box
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
1. Node.js:20.1 is needed. Recommended to use `pnpm` and `Docker`
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

## TODO