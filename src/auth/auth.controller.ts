import { BadRequestException, Body, Controller, Get, HttpCode, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterRequest } from './dto/register.request';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { GetUser } from './decorator/get-user.decorator';
import { User } from '@prisma/client';
import { Response } from 'express';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { ApiBadRequestResponse, ApiBody, ApiCookieAuth, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }

    @ApiOperation({ summary: 'Register a new user' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                email: {
                    type: 'string',
                    format: 'email'
                },
                password: {
                    type: 'string'
                }
            },
            required: ['email', 'password']
        }
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'The user has been successfully registered'
    })
    @Post('register')
    register(
        @Body() registerRequest: RegisterRequest
    ) {
        return this.authService.register({ registerRequest });
    }

    @ApiOperation({ summary: 'Login a user' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                email: { type: 'string' },
                password: { type: 'string' }
            }
        }
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'The user has been successfully logged in'
    })
    @Post('login')
    @UseGuards(LocalAuthGuard)
    @HttpCode(HttpStatus.OK)
    async login(
        @GetUser() user: User,
        @Res({ passthrough: true }) response: Response
    ) {
        await this.authService.login({ user, response });
    }

    @ApiOperation({ summary: 'Refresh a user\'s token' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'The user\'s token has been successfully refreshed'
    })
    @ApiCookieAuth('refreshToken')
    @Post('refresh')
    @UseGuards(JwtRefreshAuthGuard)
    @HttpCode(HttpStatus.OK)
    async refresh(
        @GetUser() user: User,
        @Res({ passthrough: true }) response: Response,
    ) {
        await this.authService.login({ user, response });
    }

    @ApiOperation({ summary: 'Redirect to Google login' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'The user has been successfully redirected to Google login'
    })
    @Get('google/login')
    @UseGuards(GoogleAuthGuard)
    async googleLogin() { }

    @ApiOperation({ summary: 'Callback from Google login' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'The user has been successfully logged in'
    })
    @Get('google/callback')
    @UseGuards(GoogleAuthGuard)
    async googleCallback(
        @GetUser() user: User,
        @Res({ passthrough: true }) response: Response
    ) {
        await this.authService.login({ user, response });
    }

}
