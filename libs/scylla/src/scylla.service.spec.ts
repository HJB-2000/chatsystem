import { Test, TestingModule } from '@nestjs/testing';
import { ScyllaService } from './scylla.service';

describe('ScyllaService', () => {
  let service: ScyllaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScyllaService],
    }).compile();

    service = module.get<ScyllaService>(ScyllaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
