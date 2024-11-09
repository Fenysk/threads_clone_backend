import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@prisma/client';
import { JwtAccessAuthGuard } from 'src/auth/guards/jwt-access-auth.guard';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService
    ) { }

    @UseGuards(JwtAccessAuthGuard)
    @Get()
    getAllUsers(): Promise<User[]> {
        return this.usersService.getAllUsers();
    }

}
