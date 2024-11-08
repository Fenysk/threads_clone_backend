import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {

    onModuleInit() {
        this.$connect()
            .then(() => console.log('Connected to the database'))
            .catch((error) => console.error('Failed to connect to the database : ', error));
    }

    onModuleDestroy() {
        this.$disconnect()
            .then(() => console.log('Disconnected from the database'))
            .catch((error) => console.error('Failed to disconnect from the database : ', error));
    }

    handleError(error: Error): never {
        console.error('Database error:', error);

        if (error.name === 'PrismaClientKnownRequestError') {
            const prismaError = error as Prisma.PrismaClientKnownRequestError;
            switch (prismaError.code) {
                case 'P2002':
                    throw new ConflictException('An entry with this data already exists',
                        {
                            cause: error,
                            description: `Unique constraint failed on fields: ${(prismaError.meta as any)?.target}`
                        });
                case 'P2025':
                    throw new NotFoundException('Resource not found',
                        {
                            cause: error,
                            description: prismaError.meta?.cause as string
                        });
                default:
                    throw new InternalServerErrorException('Database error',
                        {
                            cause: error,
                            description: `Prisma error code: ${prismaError.code}`
                        });
            }
        }
        throw error;
    }

}
