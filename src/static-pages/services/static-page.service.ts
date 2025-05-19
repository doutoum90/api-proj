import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StaticPage } from '../entities/static-page.entity';
import { CreateStaticPageDto } from '../dto/create-static-page.dto';
import { UpdateStaticPageDto } from '../../static-pages/dto/update-static-page.dto';

@Injectable()
export class StaticPageService {
  constructor(
    @InjectRepository(StaticPage)
    private readonly staticPageRepository: Repository<StaticPage>,
  ) {}

  async create(createStaticPageDto: CreateStaticPageDto): Promise<StaticPage> {
    const page = this.staticPageRepository.create(createStaticPageDto);
    return this.staticPageRepository.save(page);
  }

  async findAll(): Promise<StaticPage[]> {
    return this.staticPageRepository.find();
  }

  async findOne(id: string): Promise<StaticPage> {
    const page = await this.staticPageRepository.findOne({ where: { id } });
    if (!page) {
      throw new NotFoundException(`Page with ID ${id} not found`);
    }
    return page;
  }

  async findBySlug(slug: string): Promise<StaticPage> {
    const page = await this.staticPageRepository.findOne({ where: { slug } });
    if (!page) {
      throw new NotFoundException(`Page with slug ${slug} not found`);
    }
    return page;
  }

  async update(id: string, updateStaticPageDto: UpdateStaticPageDto): Promise<StaticPage> {
    const page = await this.findOne(id);
    Object.assign(page, updateStaticPageDto);
    return this.staticPageRepository.save(page);
  }

  async remove(id: string): Promise<void> {
    const result = await this.staticPageRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Page with ID ${id} not found`);
    }
  }
} 