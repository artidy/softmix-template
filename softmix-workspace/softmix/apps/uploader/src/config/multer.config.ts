import { diskStorage } from 'multer';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

import { generateFileName, getFullPathDirectory } from '../app/helpers';

export const getMulterConfig = (destination: string, maxFileSize: number): MulterOptions => {
  return {
    storage: diskStorage({
      destination: getFullPathDirectory(destination),
      filename: (req, file, cb) => cb(null, generateFileName(req, file))
    }),
    limits: {
      fileSize: maxFileSize,
    }
  }
}
