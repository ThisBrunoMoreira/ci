import { Test, TestingModule } from '@nestjs/testing';
import { EnvConfigModule } from './env-config.module';
import { EnvConfigService } from './env-config.service';

describe('EnvConfigService', () => {
  let sut: EnvConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [EnvConfigModule.forRoot()],
      providers: [EnvConfigService],
    }).compile();

    sut = module.get<EnvConfigService>(EnvConfigService);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  describe('getAppPort method', () => {
    it('should return the variable PORT', () => {
      expect(sut.getAppPort()).toBe(3000);
    });
  });
  describe('getNodeEnv method', () => {
    it('should return the variable NODE_ENV', () => {
      expect(sut.getNodeEnv()).toBe('test');
    });
  });
  describe('getJwtSecret method', () => {
    it('should return the variable JWT_SECRET', () => {
      expect(sut.getJwtSecret()).toBe('fake_secret');
    });
  });
  describe('getJwtExpiresInSeconds method', () => {
    it('should return the variable hour', () => {
      expect(sut.getJwtExpiresInSeconds()).toBe(86400);
    });
  });
});
