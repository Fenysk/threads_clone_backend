import { Controller, Get, HttpStatus, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@prisma/client';
import { JwtAccessAuthGuard } from 'src/auth/guards/jwt-access-auth.guard';
import { ApiCookieAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService
    ) { }

    @ApiOperation({ summary: 'Get all users' })
    @ApiCookieAuth('accessToken')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'The users have been successfully retrieved'
    })
    @Get()
    getAllUsers(): Promise<User[]> {
        return this.usersService.getAllUsers();
    }

}
