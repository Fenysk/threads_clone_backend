import { Module } from '@nestjs/common';
import { MediasController } from './medias.controller';
import { MediasService } from './medias.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploaded-files',
        filename: (request, file, callback) => {
          const date = new Date().toISOString().replace(/[:]/g, '-');
          const fileName = `${date}-${file.originalname}`;
          callback(null, fileName);
        }
      })
    }),
  ],
  controllers: [MediasController],
  providers: [MediasService]
})
export class MediasModule { }
