import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService
    ) { }

    @UseGuards(JwtAuthGuard)
    @Get()
    getAllUsers(): Promise<User[]> {
        return this.usersService.getAllUsers();
    }

}
