import bcrypt from 'bcryptjs';
import { HashUtil } from '../../src/utils/hash';

describe('HashUtil', () => {
  describe('hash', () => {
    it('should return a bcrypt hash different from the plaintext', async () => {
      const plain = 'MySecret123!';
      const hashed = await HashUtil.hash(plain);
      expect(hashed).not.toBe(plain);
      expect(hashed).toMatch(/^\$2[aby]\$/);
    });

    it('should produce different hashes for the same input (random salt)', async () => {
      const h1 = await HashUtil.hash('password123');
      const h2 = await HashUtil.hash('password123');
      expect(h1).not.toBe(h2);
    });
  });

  describe('compare', () => {
    it('should return true for a matching plaintext/hash pair', async () => {
      const plain = 'correctPassword';
      const hashed = await bcrypt.hash(plain, 10);
      const result = await HashUtil.compare(plain, hashed);
      expect(result).toBe(true);
    });

    it('should return false for a wrong plaintext', async () => {
      const hashed = await bcrypt.hash('rightPassword', 10);
      const result = await HashUtil.compare('wrongPassword', hashed);
      expect(result).toBe(false);
    });

    it('should return false for a malformed hash', async () => {
      const result = await HashUtil.compare('anything', 'not-a-valid-hash');
      expect(result).toBe(false);
    });
  });
});
