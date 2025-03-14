import { Test, TestingModule } from '@nestjs/testing';
import { MarketWatchService } from './market-watch.service';

describe('MarketWatchService', () => {
  let service: MarketWatchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MarketWatchService],
    }).compile();

    service = module.get<MarketWatchService>(MarketWatchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
