import { HttpStatus, ParseFilePipeBuilder } from '@nestjs/common';
import { Request } from 'express';
import * as path from 'path';
import { ASSETS_DIRECTORY } from '@project-lib/shared-types';

const generateFileName = (req: Request, file: Express.Multer.File): string => {
  const userId = req.params['id'];
  const mimetype = file.mimetype.split('/').reverse()[0];

  return `${userId}.${mimetype}`;
}

const getFullPathDirectory = (filePath: string) => {
  return path.join(__dirname, getShortPathDirectory(filePath));
}

const getFullPathFile = (filePath: string, fileName: string) => {
  return path.join(getFullPathDirectory(filePath), fileName);
}

const getShortPathDirectory = (filePath: string) => {
  return path.join(ASSETS_DIRECTORY, filePath);
}

const getShortPathFile = (filePath: string, fileName: string) => {
  return path.join(getShortPathDirectory(filePath), fileName);
}

const getFilePipe = (fileTypes: RegExp) => {
  return new ParseFilePipeBuilder()
    .addFileTypeValidator({
      fileType: fileTypes,
    })
    .build({
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
    })
}

export {
  generateFileName,
  getFilePipe,
  getFullPathDirectory,
  getShortPathDirectory,
  getFullPathFile,
  getShortPathFile,
}
