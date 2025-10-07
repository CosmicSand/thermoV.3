import mqtt, { MqttClient } from "mqtt";
import { LoginData } from "./login.types";
import {
  addToAndRefreshObject,
  isNeedsAutoSorting,
  sensorsResponses,
  statesForSorting,
} from "./login";
import { cardCreation } from "./cardcreation";
import { sorting } from "./sorting";

// 1. Стан сервису
interface MqttServiceState {
  client: MqttClient | null;
  connectionState:
    | "disconnected"
    | "connecting"
    | "connected"
    | "error"
    | "reconnecting";
}

const state: MqttServiceState = {
  client: null,
  connectionState: "disconnected",
};

// 2. Основная функция подключения
function connect(loginData: LoginData): Promise<void> {
  if (state.client && state.client.connected) {
    return Promise.resolve();
  }

  const { username, password, port, topic } = loginData;

  const options = {
    hostname: "mqtt.stsgh.uno",
    port,
    protocol: "wss" as const,
    path: "/mqtt",
    username,
    password,
    clientId: `wewe`,
    keepalive: 60,
    reconnectPeriod: 5000,
    connectTimeout: 30000,
    clean: true,
    rejectUnauthorized: true,
  };

  state.connectionState = "connecting";
  console.log("MQTT Service: Подключение...");

  const client = mqtt.connect("mqtt://mqtt.stsgh.uno", options);
  state.client = client;

  return new Promise((resolve, reject) => {
    // 3. Всі обробники подій тепер тут
    client.on("connect", () => {
      state.connectionState = "connected";
      console.log("MQTT Service: Успешно подключено.");

      const fullTopic = `${username}/${topic ? topic + "/" : "#"}`;
      client.subscribe(fullTopic, (err) => {
        if (err) {
          console.error("MQTT Service: Ошибка подписки", err);
          reject(err);
        } else {
          console.log(`MQTT Service: Подписка на топик ${fullTopic}`);
          resolve();
        }
      });
    });

    client.on("message", (_, message) => {
      const messageStr = message.toString().slice(0, -1);
      if (messageStr) {
        addToAndRefreshObject(messageStr);
        isNeedsAutoSorting(sensorsResponses);
        cardCreation(sensorsResponses);
        sorting(sensorsResponses, statesForSorting);
      }
    });

    client.on("error", (err) => {
      state.connectionState = "error";
      console.error("MQTT Service: Ошибка соединения", err);
      client.end();
      reject(err);
    });

    client.on("close", () => {
      state.connectionState = "disconnected";
      console.log("MQTT Service: Соединение закрыто.");
    });

    client.on("reconnect", () => {
      state.connectionState = "reconnecting";
      console.log("MQTT Service: Переподключение...");
    });
  });
}

// 4. Публичные методы сервиса
function disconnect() {
  if (state.client) {
    console.log("MQTT Service: Отключение...");
    state.client.end();
    state.client = null;
    state.connectionState = "disconnected";
  }
}

function getConnectionState() {
  return state.connectionState;
}

export const mqttService = {
  connect,
  disconnect,
  getConnectionState,
};
