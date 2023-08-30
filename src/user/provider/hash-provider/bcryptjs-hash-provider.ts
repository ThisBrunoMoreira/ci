import { compare, hash } from 'bcryptjs';
import { HashingService } from '../../../shared/application/provider/hash-provider';

export class BcryptPasswordHasher implements HashingService {
  async generateHash(payload: string): Promise<string> {
    return hash(payload, 6);
  }
  async compareHash(payload: string, hash: string): Promise<boolean> {
    return compare(payload, hash);
  }
}
