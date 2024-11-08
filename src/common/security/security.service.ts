import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as argon2 from "argon2";

@Injectable()
export class SecurityService {
    constructor(
        private readonly configService: ConfigService
    ) { }

    async hashPassword(password: string): Promise<string> {
        try {
            const secret = Buffer.from(this.configService.get<string>("ARGON2_SECRET") || '');

            const hashedPassword = await argon2.hash(password, {
                secret: secret,
            });

            return hashedPassword;
        } catch (error) {
            console.error(error);
            throw new Error(`Failed to hash password: ${error.message}`);
        }
    }

    async verifyPassword(hashedPassword: string, passwordToCompare: string): Promise<boolean> {
        try {
            const secret = Buffer.from(this.configService.get<string>("ARGON2_SECRET") || '');

            const isPasswordMatched = await argon2.verify(hashedPassword, passwordToCompare, {
                secret: secret,
            });

            return isPasswordMatched;
        } catch (error) {
            console.error(error);
            throw new Error(`Failed to verify password: ${error.message}`);
        }
    }

}
