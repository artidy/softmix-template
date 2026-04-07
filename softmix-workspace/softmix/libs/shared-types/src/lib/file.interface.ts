export interface File {
  _id?: string;
  name: string;
  ownerId: string;
}

export interface FileApi {
  id: string;
  name: string;
  ownerId: string;
  url: string;
}
