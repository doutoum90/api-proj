import { Test, TestingModule } from '@nestjs/testing';
import { VeilleService } from './news.service.ts';

describe('VeilleService', () => {
  let service: VeilleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VeilleService],
    }).compile();

    service = module.get<VeilleService>(VeilleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
