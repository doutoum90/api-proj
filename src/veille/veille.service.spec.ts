import { Test, TestingModule } from '@nestjs/testing';
import { VeilleService } from './veille.service';

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
