import { ApiProperty } from "@nestjs/swagger";

export class TrendArticleDto {
    @ApiProperty()
    title: string;

    @ApiProperty()
    url: string;
}