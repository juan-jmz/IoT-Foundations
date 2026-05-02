import { mqttClient } from "../clients/mqttClient";
import { logger } from "../utils/logger";

export function startApp() {
  mqttClient.subscribe("test/#", (msg) => {
    logger.info("Message received", msg);
  });

  setInterval(() => {
    mqttClient.publish("test/topic", {
      value: Math.random(),
      timestamp: new Date().toISOString(),
    });
  }, 5000);
}