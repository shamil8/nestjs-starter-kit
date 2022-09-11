import { Test, TestingModule } from '@nestjs/testing';
import { Erc20Service } from './erc20.service';

describe('Erc20Service', () => {
  let service: Erc20Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Erc20Service],
    }).compile();

    service = module.get<Erc20Service>(Erc20Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
