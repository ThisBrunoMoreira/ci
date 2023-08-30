import { BcryptPasswordHasher } from './bcryptjs-hash-provider';

describe('BcryptHashingService Unit Tests', () => {
  let bcryptHashService: BcryptPasswordHasher;

  beforeEach(() => {
    bcryptHashService = new BcryptPasswordHasher();
  });

  it('should generate and return encrypted password', async () => {
    const password = 'any_password';
    const hash = await bcryptHashService.generateHash(password);
    expect(hash).toBeDefined();
  });

  it('should return false for mismatched passwords', async () => {
    const password = 'any_password';
    const hash = await bcryptHashService.generateHash(password);
    const result = await bcryptHashService.compareHash('fake', hash);
    expect(result).toBeFalsy();
  });

  it('should return true for matching passwords', async () => {
    const password = 'any_password';
    const hash = await bcryptHashService.generateHash(password);
    const result = await bcryptHashService.compareHash(password, hash);
    expect(result).toBeTruthy();
  });
});
