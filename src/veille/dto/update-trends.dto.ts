import { PartialType } from '@nestjs/mapped-types';
import { CreateTrendsDto } from './create-trends.dto';

export class UpdateTrendsDto extends PartialType(CreateTrendsDto) {}
