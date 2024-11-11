import { IsOptional, IsString, IsUrl } from "class-validator";

export class UpdatePostRequest {
    @IsString()
    @IsOptional()
    textContent?: string;

    @IsOptional()
    @IsString({ each: true })
    @IsUrl({}, { each: true })
    mediaUrls?: string[];
}