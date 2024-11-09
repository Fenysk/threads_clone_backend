import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";
import { LoginRequest } from "../dto/login.request";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly authService: AuthService
    ) {
        super({
            usernameField: 'email',
        });
    }

    async validate(loginRequest: LoginRequest) {
        return this.authService.verifyUser({ email: loginRequest.email, password: loginRequest.password });
    }

}
