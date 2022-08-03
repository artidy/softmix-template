interface DatabaseInterface {
  get models(): any;
  connect(uri: string, database: string): Promise<void>;
  disconnect(): Promise<void>;
}

export default DatabaseInterface;
