import {
  Body,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipeBuilder,
} from '@nestjs/common';
import { Post, Req } from '@nestjs/common';
import { UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadedFile } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { Logger } from '@nestjs/common';
import { ParseFilePipe } from '@nestjs/common';
import { FileValidator } from '@nestjs/common';
var path = require('path');

interface myConfig {
  supportedImageExtentions: string[];
  supportedMimeTypes: string[];
  avatarStoragePath: string;
  oneKB: number;
  maxSizeMB: number;
}

const config: myConfig = {
  supportedImageExtentions: ['.jpg', '.jpeg', '.png', '.gif'],
  supportedMimeTypes: ['image/jpeg', 'image/png', 'image/gif'],
  oneKB: 1024,
  maxSizeMB: 6,
  avatarStoragePath: './src/storage/avatar',
};

const logger = new Logger();

const avatarUploadOptions: MulterOptions = {
  storage: diskStorage({
    destination: config.avatarStoragePath,
    filename: (req: any, file: any, cb: any) => {
      logger.log('body here', req.body);
      const userId = req.body['userId'];
      const extension: string = path.parse(file.originalname).ext;
      cb(null, `${userId}${extension}`);
    },
  }),
  // fileFilter: (req: any, file: any, cb: any) => {
  // cb(null, true);
  // logger.log('__TEST_SIZE__');
  // logger.log(file);
  // var _path = require('path');
  // const fileExtension: string = _path
  //   .parse(file.originalname)
  //   .ext.toLowerCase();
  // const { mimetype, size } = file;
  // if (size > config.maxSizeMB * config.oneKB) {
  //   cb(`File size exceeds ${config.maxSizeMB}MB`);
  // } else if (
  //   config.supportedImageExtentions.indexOf(fileExtension) == -1 ||
  //   config.supportedMimeTypes.indexOf(mimetype) == -1
  // ) {
  //   cb('Unsupported file format: ' + fileExtension);
  // } else {
  //   cb(null, true);
  // }
  // },
};

@Controller('avatar')
export class FileController {
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', avatarUploadOptions))
  uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: /.(jpg|jpeg|png|gif)$/ }),
          new MaxFileSizeValidator({
            maxSize: config.maxSizeMB * config.oneKB * config.oneKB,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Req() req: Request,
  ) {
    logger.log('ok');
    logger.log(req.body);
    // logger.log('req', JSON.stringify(req));
  }
}
