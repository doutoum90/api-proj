import { PartialType } from '@nestjs/swagger';
import { CreateSentimentDto } from './create-sentiment.dto';

export class UpdateSentimentDto extends PartialType(CreateSentimentDto) {}
