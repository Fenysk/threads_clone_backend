import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateUserRequest {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsOptional()
    hashedPassword?: string;
}
