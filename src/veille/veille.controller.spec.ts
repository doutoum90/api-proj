import { Test, TestingModule } from '@nestjs/testing';
import { VeilleController } from './veille.controller';
import { VeilleService } from './veille.service';

describe('VeilleController', () => {
  let controller: VeilleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VeilleController],
      providers: [VeilleService],
    }).compile();

    controller = module.get<VeilleController>(VeilleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
