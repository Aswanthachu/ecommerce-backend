import express, { Application } from 'express'
import * as dotenv from 'dotenv'
dotenv.config()

import cors from 'cors'
import { RegisterRoutes } from './routes/routes'
import { config } from './src/helper/config/globalConfig'
import PrismaDatabase from './src/helper/db/prismaDatabase';
import { expressLogger, logger } from './src/helper/utils/logger'
import SwaggerDoc from './src/helper/utils/swaggerSetup'

class App {
  public app: Application
  private prismaDb: PrismaDatabase;

  constructor() {
    this.app = express()
    this.configureCORS()
    this.setupLogger()
    this.plugins()
    this.prismaDb = new PrismaDatabase();
    this.routes()
  }

  protected configureCORS(): void {
    const allowedOrigins = ['http://localhost:3000', 'http://localhost:4545']
    this.app.use(
      cors({
        origin: function (origin, callback) {
          if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true)
          } else {
            console.log('Not allowed by CORS')
            callback(new Error('Not allowed by CORS'))
          }
        }
      })
    )
  }

  protected plugins(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }))
  }

  protected setupLogger(): void {
    this.app.use(expressLogger)
  }

  protected routes(): void {
    SwaggerDoc.init(this.app)
    RegisterRoutes(this.app)
  }
}

const app = new App().app
const port: number | undefined = config.HOST_PORT
app.listen(port, () => {
  logger.info(`Server is running on port ${port}`)
})
