import { BadRequestException, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileResponse } from './dto/file.response';
import { ConfigService } from '@nestjs/config';

@Controller('files')
export class FilesController {
    constructor(
        private readonly configService: ConfigService,
    ) { }

    @Post('upload')
    @UseInterceptors(
        FileInterceptor('file'))
    async uploadFile(
        @UploadedFile() file: Express.Multer.File
    ): Promise<FileResponse> {
        if (!file)
            throw new BadRequestException('No file uploaded');

        const baseUrl = this.configService.get('APP_URL');
        const imageUrl = `${baseUrl}/${file.path}`;

        return {
            file,
            url: imageUrl
        };
    }

    @Post('upload-image')
    @UseInterceptors(
        FileInterceptor('file', {
            fileFilter: (req, file, callback) => {
                const allowedMimetypes = [
                    'image/jpeg',
                    'image/jpg',
                    'image/gif',
                    'image/webp'
                ];
                callback(null, allowedMimetypes.includes(file.mimetype));
            }
        })
    )
    async uploadImage(
        @UploadedFile() file: Express.Multer.File
    ): Promise<FileResponse> {
        return this.uploadFile(file);
    }

}
