import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsInt } from "class-validator";
import { Transform, Type } from "class-transformer";

export class PaginationRequest {
    @ApiProperty({ required: false, description: 'Page number for pagination' })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    @Transform(({ value }) => parseInt(value))
    page: number;

    @ApiProperty({ required: false, description: 'Number of items per page' })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    @Transform(({ value }) => parseInt(value))
    limit: number;
}
