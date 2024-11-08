import { Body, Controller, HttpCode, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterRequest } from './dto/register.request';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { GetUser } from './decorator/get-user.decorator';
import { User } from '@prisma/client';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }

    @Post('register')
    register(
        @Body() registerRequest: RegisterRequest
    ) {
        return this.authService.register(registerRequest);
    }

    @Post('login')
    @UseGuards(LocalAuthGuard)
    @HttpCode(HttpStatus.OK)
    async login(
        @GetUser() user: User,
        @Res({ passthrough: true }) response: Response
    ) {
        await this.authService.login(user, response);
    }

}
