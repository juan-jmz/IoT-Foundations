import dotenv from "dotenv";

dotenv.config();

function required(name: string, value?: string) {
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

function toBool(value?: string, defaultValue = false): boolean {
  if (value === undefined) return defaultValue;
  return value.toLowerCase() === "true";
}

function toQoS(value?: string): 0 | 1 | 2 {
  const num = Number(value);
  if (num === 0 || num === 1 || num === 2) return num;
  throw new Error("MQTT_QOS must be 0, 1 or 2");
}

export const env = {
  MQTT_HOST: required("MQTT_HOST", process.env.MQTT_HOST),
  MQTT_PORT: Number(required("MQTT_PORT", process.env.MQTT_PORT)),
  MQTT_PROTOCOL: required("MQTT_PROTOCOL", process.env.MQTT_PROTOCOL),

  MQTT_CLIENT_ID: required("MQTT_CLIENT_ID", process.env.MQTT_CLIENT_ID),

  MQTT_USERNAME: process.env.MQTT_USERNAME,
  MQTT_PASSWORD: process.env.MQTT_PASSWORD,

  MQTT_USE_TLS: toBool(process.env.MQTT_USE_TLS),
  MQTT_CA_PATH: process.env.MQTT_CA_PATH,

  MQTT_CLEAN: toBool(process.env.MQTT_CLEAN, true),
  MQTT_QOS: toQoS(process.env.MQTT_QOS),
};