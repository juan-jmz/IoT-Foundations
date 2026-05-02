import mqtt, { IClientOptions, MqttClient } from "mqtt";
import fs from "fs";
import { env } from "../config/env";
import { logger } from "../utils/logger";

type Handler = (msg: any, topic: string) => void;

class MQTTClient {
  private client: MqttClient;
  private handlers: Record<string, Handler> = {};
  private isConnected = false;
  private queue: { topic: string; payload: any }[] = [];

  constructor() {
    const protocol = env.MQTT_USE_TLS ? "mqtts" : "mqtt";
    const port = env.MQTT_USE_TLS ? 8883 : env.MQTT_PORT;
    const url = `${protocol}://${env.MQTT_HOST}:${port}`;

    const options: IClientOptions = {
      clientId: env.MQTT_CLIENT_ID,
      clean: env.MQTT_CLEAN,
      reconnectPeriod: 3000,
      keepalive: 30,
    };

    if (env.MQTT_USERNAME) options.username = env.MQTT_USERNAME;
    if (env.MQTT_PASSWORD) options.password = env.MQTT_PASSWORD;

    if (env.MQTT_USE_TLS && env.MQTT_CA_PATH) {
      options.ca = fs.readFileSync(env.MQTT_CA_PATH);
    }

    this.client = mqtt.connect(url, options);

    this.registerEvents();
    this.handleShutdown();
  }

  private registerEvents() {
    this.client.on("connect", () => {
      this.isConnected = true;
      logger.info("MQTT connected");

      this.resubscribeAll();
      this.flushQueue();
    });

    this.client.on("reconnect", () => {
      logger.info("MQTT reconnecting...");
    });

    this.client.on("close", () => {
      this.isConnected = false;
      logger.error("MQTT connection closed");
    });

    this.client.on("error", (err) => {
      logger.error("MQTT error", err);
    });

    this.client.on("message", (topic, message) => {
      let parsed: any;

      try {
        parsed = JSON.parse(message.toString());
      } catch {
        logger.error("Invalid JSON message", { topic });
        return;
      }

      Object.entries(this.handlers).forEach(([sub, handler]) => {
        if (this.matches(topic, sub)) {
          handler(parsed, topic);
        }
      });
    });
  }

  private resubscribeAll() {
    Object.keys(this.handlers).forEach((topic) => {
      this.client.subscribe(topic, { qos: env.MQTT_QOS }, (err) => {
        if (err) logger.error("Resubscribe error", err);
      });
    });
  }

  private flushQueue() {
    while (this.queue.length > 0) {
      const msg = this.queue.shift();
      if (msg) this.publish(msg.topic, msg.payload);
    }
  }

  publish(topic: string, payload: any) {
    if (!this.isConnected) {
      this.queue.push({ topic, payload });
      return;
    }

    const message = JSON.stringify(payload);

    this.client.publish(topic, message, { qos: env.MQTT_QOS }, (err) => {
      if (err) logger.error("Publish error", err);
    });
  }

  subscribe(topic: string, handler: Handler) {
    this.handlers[topic] = handler;

    this.client.subscribe(topic, { qos: env.MQTT_QOS }, (err) => {
      if (err) logger.error("Subscribe error", err);
    });
  }

  private matches(topic: string, sub: string): boolean {
    if (sub === "#") return true;

    const subParts = sub.split("/");
    const topicParts = topic.split("/");

    for (let i = 0; i < subParts.length; i++) {
      if (subParts[i] === "#") return true;
      if (subParts[i] === "+") continue;
      if (topicParts[i] !== subParts[i]) return false;
    }

    return subParts.length === topicParts.length;
  }

  private handleShutdown() {
    const shutdown = () => {
      logger.info("MQTT shutting down...");
      this.client.end(false, () => {
        process.exit(0);
      });
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  }
}

export const mqttClient = new MQTTClient();