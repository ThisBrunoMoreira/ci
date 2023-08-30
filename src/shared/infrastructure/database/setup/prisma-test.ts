import { execSync } from 'child_process';

export function setupPrismaTest() {
  execSync(
    'npx dotenv-cli -e .env.test -- npx prisma migrate deploy --schema ./src/shared/infrastructure/database/prisma/schema.prisma',
  );
}
