import { Test, TestingModule } from '@nestjs/testing';
import { MarketWatchController } from './market-watch.controller';
import { MarketWatchService } from './services/market-watch.service';

describe('MarketWatchController', () => {
  let controller: MarketWatchController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MarketWatchController],
      providers: [MarketWatchService],
    }).compile();

    controller = module.get<MarketWatchController>(MarketWatchController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
