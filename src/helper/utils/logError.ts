import { logger } from "./logger";

export function logError(error: Error | any): void {
    if (error) {
      logger.error(error);
    }
  }