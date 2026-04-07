import { File } from '@project-lib/shared-types';

export class ProductImageEntity implements File {
  ownerId: string;
  name: string;

  constructor(file: File) {
    this.fillEntity(file);
  }

  public toObject() {
    return { ...this };
  }

  public fillEntity(file: File) {
    this.ownerId = file.ownerId;
    this.name = file.name;
  }
}
