import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

class PrismaDatabase {
  public prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
    this.connectToDatabase();
  }

  private async connectToDatabase() {
    try {
      await this.prisma.$connect();
      logger.info('Connected to Supabase using Prisma.');
    } catch (err) {
      logger.error('Unable to connect to Supabase:', err);
      process.exit(1);
    }
  }
}

export default PrismaDatabase;
