import { Test, TestingModule } from '@nestjs/testing';
import { ProvablyFairController } from './provably-fair.controller';

describe('ProvablyFairController', () => {
  let controller: ProvablyFairController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProvablyFairController],
    }).compile();

    controller = module.get<ProvablyFairController>(ProvablyFairController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
