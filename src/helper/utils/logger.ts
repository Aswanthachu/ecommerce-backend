import winston from "winston";
import expressWinston from "express-winston";
import { format } from "date-fns";
import path from "path";
import fs from "fs";

const logsDirectory = path.resolve(process.cwd(), "logs");
if (!fs.existsSync(logsDirectory)) {
  fs.mkdirSync(logsDirectory);
}
const logFileName = `${format(new Date(), "yyyy-MM-dd")}.log`;

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(logsDirectory, logFileName),
    }),
  ],
});

const expressLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({
      filename: path.join(logsDirectory, logFileName),
    }),
  ],
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.simple()
  ),
  meta: true,
  msg: "HTTP {{req.method}} {{req.url}}",
  expressFormat: true,
  colorize: true,
});

export { logger, expressLogger };
