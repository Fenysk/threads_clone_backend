import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterRequest } from './dto/register.request';
import { CreateUserRequest } from 'src/users/dto/create-user.request';
import { SecurityService } from 'src/common/security/security.service';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from './interfaces/token-payload.interface';
import { Response } from 'express';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly securityService: SecurityService,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService
    ) { }

    async register(registerRequest: RegisterRequest) {
        const createUserRequest = new CreateUserRequest();

        createUserRequest.email = registerRequest.email;
        createUserRequest.hashedPassword = await this.securityService.hashPassword(registerRequest.password);

        const user = await this.usersService.createUser(createUserRequest);

        return user;
    }

    async verifyUser(email: string, password: string): Promise<User> {
        try {
            const user = await this.usersService.findUser({ email });

            const isPasswordMatched = await this.securityService.verifyPassword(user.hashedPassword, password);

            if (!isPasswordMatched)
                throw new UnauthorizedException('Invalid credentials');

            return user;
        } catch (error) {
            throw new UnauthorizedException('Invalid credentials');
        }
    }

    async login(
        user: User,
        response: Response
    ) {
        const expirationAccessTokenMs = parseInt(
            this.configService.getOrThrow('JWT_ACCESS_TOKEN_EXPIRATION_MS')
        );

        const expiresAccessToken = new Date();

        expiresAccessToken.setMilliseconds(
            expiresAccessToken.getTime() +
            expirationAccessTokenMs
        );

        const tokenPayload: TokenPayload = { userId: user.id }

        const accessToken = this.jwtService.sign(
            tokenPayload,
            {
                secret: this.configService.getOrThrow('JWT_ACCESS_TOKEN_SECRET'),
                expiresIn: `${expirationAccessTokenMs}ms`
            }
        );

        const shouldHaveSecureConnection = this.configService.getOrThrow('NODE_ENV') !== 'development';

        response.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: shouldHaveSecureConnection,
            expires: expiresAccessToken,
        });
    }

}
