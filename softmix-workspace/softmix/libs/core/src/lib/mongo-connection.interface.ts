export interface MongoConnection {
  username: string | undefined;
  password: string | undefined;
  host: string | undefined;
  port: number | undefined;
  databaseName: string | undefined;
  authDatabase: string | undefined;
}
