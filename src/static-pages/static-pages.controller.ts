import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { StaticPageService } from './services/static-page.service';
import { CreateStaticPageDto } from './dto/create-static-page.dto';
import { UpdateStaticPageDto } from './dto/update-static-page.dto';
import { UserAuthGuard } from '../auth/guards/user-auth.guard';
import { AdminAuthGuard } from '../auth/guards/admin.guard';

@Controller('api/static-pages')
export class StaticPagesController {
  constructor(private readonly staticPageService: StaticPageService) { }

  @Post()
  @UseGuards(UserAuthGuard, AdminAuthGuard)
  create(@Body() createStaticPageDto: CreateStaticPageDto) {
    return this.staticPageService.create(createStaticPageDto);
  }

  @Get()
  findAll() {
    return this.staticPageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.staticPageService.findOne(id);
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.staticPageService.findBySlug(slug);
  }

  @Put(':id')
  @UseGuards(UserAuthGuard, AdminAuthGuard)
  update(@Param('id') id: string, @Body() updateStaticPageDto: UpdateStaticPageDto) {
    return this.staticPageService.update(id, updateStaticPageDto);
  }

  @Delete(':id')
  @UseGuards(UserAuthGuard, AdminAuthGuard)
  remove(@Param('id') id: string) {
    return this.staticPageService.remove(id);
  }
} 