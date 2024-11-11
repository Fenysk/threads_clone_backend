import { BadRequestException, Controller, HttpStatus, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileResponse } from './dto/file.response';
import { ConfigService } from '@nestjs/config';
import { ApiBody, ApiConsumes, ApiCookieAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('medias')
export class MediasController {
    constructor(
        private readonly configService: ConfigService,
    ) { }

    @ApiOperation({ summary: 'Upload a file' })
    @ApiConsumes('multipart/form-data')
    @ApiCookieAuth('accessToken')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: { type: 'string', format: 'binary' }
            }
        }
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'The file has been successfully uploaded',
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'object',
                    properties: {
                        fieldname: { type: 'string' },
                        originalname: { type: 'string' },
                        encoding: { type: 'string' },
                        mimetype: { type: 'string' },
                        destination: { type: 'string' },
                        filename: { type: 'string' },
                        path: { type: 'string' },
                        size: { type: 'number' }
                    }
                },
                url: { type: 'string' }
            }
        },
    })
    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
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

    @ApiOperation({ summary: 'Upload an image' })
    @ApiConsumes('multipart/form-data')
    @ApiCookieAuth('accessToken')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'Image file (JPEG, JPG, GIF or WEBP)'
                }
            }
        }
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'The image has been successfully uploaded',
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'object',
                    properties: {
                        fieldname: { type: 'string' },
                        originalname: { type: 'string' },
                        encoding: { type: 'string' },
                        mimetype: { type: 'string' },
                        destination: { type: 'string' },
                        filename: { type: 'string' },
                        path: { type: 'string' },
                        size: { type: 'number' }
                    }
                },
                url: { type: 'string' }
            }
        },
    })
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
