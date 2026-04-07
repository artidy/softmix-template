export type FileUrl = {
  id: string;
  name: string;
  ownerId: string;
  url: string;
}

export type UploadFile = {
  ownerId: string;
  name: string;
  file: File;
}
