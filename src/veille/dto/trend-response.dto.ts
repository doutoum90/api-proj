import { ApiProperty } from "@nestjs/swagger";
import { TrendArticleDto } from "./trend-article-response.dto";

export class TrendResponseDto {
    @ApiProperty()
    keyword: string;

    @ApiProperty()
    score: number;

    @ApiProperty()
    articles: TrendArticleDto[];
}