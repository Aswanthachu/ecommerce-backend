import express, { Application } from 'express';
import * as dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import { RegisterRoutes } from './routes/routes';
import { config } from './src/helper/config/globalConfig';
import PrismaDatabase from './src/helper/db/prismaDatabase';
import { expressLogger, logger } from './src/helper/utils/logger';
import SwaggerDoc from './src/helper/utils/swaggerSetup';

class App {
  public app: Application;
  public prismaDb: PrismaDatabase; // Change to public to access it in shutdown

  constructor() {
    this.app = express();
    this.configureCORS();
    this.setupLogger();
    this.plugins();
    this.prismaDb = new PrismaDatabase();
    this.routes();
  }

  protected configureCORS(): void {
    const allowedOrigins = ['http://localhost:3000', 'http://localhost:4545'];
    this.app.use(
      cors({
        origin: (origin, callback) => {
          if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
          } else {
            logger.warn('Not allowed by CORS:', origin);
            callback(new Error('Not allowed by CORS'));
          }
        }
      })
    );
  }

  protected plugins(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
  }

  protected setupLogger(): void {
    this.app.use(expressLogger);
  }

  protected routes(): void {
    SwaggerDoc.init(this.app);
    RegisterRoutes(this.app);
  }
}

const appInstance = new App();
const app = appInstance.app;
const port: number | undefined = config.HOST_PORT;

const server = app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});

const shutdown = async () => {
  logger.info('Shutting down server...');
  await appInstance.prismaDb.disconnect();
  server.close(() => {
    logger.info('Server has been shut down.');
    process.exit(0);
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
