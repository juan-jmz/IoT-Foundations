# IoT-Foundations

Plantilla base para construir microservicios IoT en TypeScript listos para producción. Este repositorio define estándares, estructura y utilidades reutilizables para todos los proyectos del ecosistema.

Es una base operativa.

---

## 🎯 Objetivo

Proveer una base sólida para:

- Crear microservicios escalables en TypeScript
- Conectarse a brokers MQTT
- Manejar configuración de forma segura
- Implementar logging estructurado
- Ejecutar servicios en contenedores Docker

---

## 🚀 ¿Qué incluye?

- Estructura base de proyecto
- Configuración con variables de entorno validadas
- Cliente MQTT listo para producción básica:
  - Reconexión automática
  - Soporte para wildcards (+, #)
  - Re-suscripción automática
  - Cola en memoria cuando no hay conexión
  - Soporte TLS (mqtts + CA opcional)
- Logger centralizado
- Manejo básico de errores
- Dockerfile listo para despliegue

---

## 📁 Estructura del proyecto

```
/src
  /config        → Manejo de variables de entorno
  /clients       → Clientes externos (MQTT, DB, etc.)
  /services      → Lógica principal
  /utils         → Funciones auxiliares

/security        → Certificados (CA, etc.)

/docker
.env.example
package.json
tsconfig.json
README.md
```

---

## ⚙️ Setup rápido

### 1. Clonar repositorio

```bash
git clone https://github.com/tu-usuario/iot-foundations.git
cd iot-foundations
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env
```

Ejemplo mínimo:

```
MQTT_HOST=broker.hivemq.com
MQTT_PORT=1883
MQTT_PROTOCOL=mqtt
MQTT_CLIENT_ID=iot-foundations-client

MQTT_USE_TLS=false
```

---

## ▶️ Ejecutar

```bash
npm run dev
```

El servicio:

- Se conecta al broker
- Se suscribe a un topic
- Publica mensajes periódicamente
- Recibe esos mismos mensajes

---

## 🐳 Docker

### Build

```bash
docker build -t iot-foundations .
```

### Run

```bash
docker run --env-file .env iot-foundations
```

---

## 📡 MQTT

El cliente MQTT incluido cubre:

- Conexión y reconexión automática
- Soporte completo para wildcards
- Routing interno de mensajes
- Publicación con QoS configurable
- Soporte TLS con CA opcional

Ejemplo de uso:

```ts
mqttClient.subscribe("test/#", (msg, topic) => {
  console.log(topic, msg);
});

mqttClient.publish("test/topic", {
  value: 42,
  timestamp: new Date().toISOString()
});
```

---

## 🧱 Convenciones

- TypeScript estricto
- Variables de entorno obligatorias
- No usar console.log en lógica de negocio
- Servicios desacoplados
- Logging estructurado (JSON)

---

## 🚀 Guía rápida para crear tu propio proyecto

1. Clona este repositorio
2. Cambia el nombre del proyecto en `package.json`
3. Ajusta `.env` según tu broker
4. Modifica `app.service.ts` con tu lógica

Ejemplo:

- Suscribirte a múltiples topics
- Procesar datos
- Enviar a base de datos
- Publicar resultados

---

## 👤 Author

Juan Manuel Jiménez (Juanma-Tech)

---

## 🏁 Uso esperado

Este repo se utiliza como:

- Base para nuevos microservicios
- Estándar dentro del ecosistema IoT
- Punto de partida para sistemas escalables
