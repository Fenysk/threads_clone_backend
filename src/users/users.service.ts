import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserRequest } from './dto/create-user.request';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UsersService {
    constructor(
        private readonly prismaService: PrismaService
    ) { }

    async getAllUsers(): Promise<User[]> {
        return this.prismaService.user.findMany();
    }

    async findUser({
        id,
        email,
    }: {
        id?: string;
        email?: string;
    }): Promise<User> {
        const user = await this.prismaService.user.findUnique({
            where: {
                id,
                email,
            }
        });

        if (!user)
            throw new NotFoundException('User not found');

        return user;
    }

    async createUser(
        createUserRequest: CreateUserRequest
    ): Promise<User> {
        try {
            const user = await this.prismaService.user.create({
                data: {
                    email: createUserRequest.email.toLowerCase(),
                    hashedPassword: createUserRequest.hashedPassword
                }
            });

            return user;
        } catch (error) {
            this.prismaService.handleError(error);
        }
    }

    async updateUser(
        where: Prisma.UserWhereUniqueInput,
        data: Prisma.UserUpdateInput,
    ): Promise<User> {
        return this.prismaService.user.update({
            where,
            data,
        });
    }

}
