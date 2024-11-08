import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as argon2 from "argon2";

@Injectable()
export class SecurityService {
    constructor(
        private readonly configService: ConfigService
    ) { }

    async hashData(data: string): Promise<string> {
        try {
            const secret = Buffer.from(this.configService.get<string>("ARGON2_SECRET") || '');

            const hashedData = await argon2.hash(data, {
                secret: secret,
            });

            return hashedData;
        } catch (error) {
            console.error(error);
            throw new Error(`Failed to hash data: ${error.message}`);
        }
    }

    async verifyData(hashedData: string, dataToCompare: string): Promise<boolean> {
        try {
            const secret = Buffer.from(this.configService.get<string>("ARGON2_SECRET") || '');

            const isDataMatched = await argon2.verify(hashedData, dataToCompare, {
                secret: secret,
            });

            return isDataMatched;
        } catch (error) {
            console.error(error);
            throw new Error(`Failed to verify data: ${error.message}`);
        }
    }

}
