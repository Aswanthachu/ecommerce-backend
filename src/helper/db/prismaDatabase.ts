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
      logger.info('Connected to the database using Prisma.');
    } catch (err) {
      logger.error('Unable to connect to the database:', err);
      process.exit(1);
    }
  }

  public async disconnect() {
    try {
      await this.prisma.$disconnect();
      logger.info('Disconnected from the database.');
    } catch (err) {
      logger.error('Error disconnecting from the database:', err);
    }
  }
}

export default PrismaDatabase;
