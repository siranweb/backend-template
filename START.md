# {project_name}

{description}

## Requirements
* NodeJS >= v20.x.x
* pnpm (package manager)
* Docker with docker-compose

## Run application

### For development
1. Install dependencies
    ```shell
    pnpm install
    ```
2. Provide environment variables (see `env/examples`):
   * `env/run/app.env`
   * `env/run/app-database.env`
3. Start application services
    ```shell
    pnpm run compose:dev:up
    ```
4. Start application itself
    ```shell
    pnpm run start:dev
    ```
5. Run migrations
   ```shell
   pnpm run app-database:migrations:sync
   ```

### For production
1. Provide environment variables (see `env/examples`):
    * `env/run/app.env`
    * `env/run/app-database.env`
2. Start app with services
    ```shell
    pnpm run compose:up
    ```
3. Open shell in docker container and run migrations
   ```shell
   docker exec -it <container_id> bash
   cd app
   pnpm run app-database:migrations:sync
   ```