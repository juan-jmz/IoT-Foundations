import { startApp } from "./services/appService";
import { logger } from "./utils/logger";

async function main() {
  try {
    startApp();
  } catch (error) {
    logger.error("Fatal error", error);
    process.exit(1);
  }
}

main();