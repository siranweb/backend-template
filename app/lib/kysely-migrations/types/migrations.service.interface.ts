export interface IMigrationsService {
  create(migrationsPath: string, name: string): Promise<void>;
  sync(migrationsPath: string): Promise<void>;
  up(migrationsPath: string): Promise<void>;
  down(migrationsPath: string): Promise<void>;
}
