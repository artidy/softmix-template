interface DatabaseInterface {
  connect(uri: string, database: string): Promise<void>;
  disconnect(): Promise<void>;
}

export default DatabaseInterface;
