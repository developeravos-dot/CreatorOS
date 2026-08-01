import { IsOptional, IsString } from "class-validator";

export class AnalyzeContentDto {

    @IsString()
    title!: string;

    @IsString()
    description!: string;

    @IsOptional()
    @IsString()
    language?: string;

    @IsOptional()
    @IsString()
    platform?: string;
}
