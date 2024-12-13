import { ApiProperty } from "@nestjs/swagger";
import { Visibility } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl } from "class-validator";

export class CreatePostRequest {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    textContent: string;

    @ApiProperty({ type: [String] })
    @IsOptional()
    @IsString({ each: true })
    @IsUrl({}, { each: true })
    mediaUrls: string[];

    @ApiProperty({ required: false, description: 'ID of the post to reply to' })
    @IsOptional()
    @IsString()
    replyToId?: string;

    @ApiProperty({ required: false, description: 'ID of the post to quote' })
    @IsOptional()
    @IsString()
    quoteToId?: string;

    @ApiProperty({ required: false, enum: Visibility })
    @IsOptional()
    @IsEnum(Visibility)
    visibility?: Visibility
}