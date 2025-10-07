import { SensorsResponse } from "./login.types";
import { StatesForSorting } from "./sorting.types";

const TYPES_0F_EQUIPMENT = {
  SENSOR: "sensor",
  BOILER: "boiler",
  GATEWAY: "gateway",
};

export let sensorsResponses: SensorsResponse = {};

export const statesForSorting = {} as StatesForSorting;

// Функція, яка додає до об'єкту користувачів та точки контролю для кожного окремо, а також оновлює дані кожної з точок при надходженні нових значень

export function addToAndRefreshObject(messageStr: string) {
  if (messageStr.includes(":")) return;

  // Трансформація повідомлення в зручну форму. Відокремлення власника та сенсора

  const currentResponse = messageStr.split(";");
  const ownerId = currentResponse[0];
  const sensorData = currentResponse
    .slice(1)
    .map((sensor, i) => {
      if (i === 0 || sensor.includes("-")) {
        return parseInt(sensor).toString();
      } else {
        return Number(parseFloat(sensor).toFixed(1))
          ? parseFloat(sensor).toFixed(1)
          : sensor;
      }
    })
    .toSpliced(4, 2);

  const sensorNumber: number = Number(sensorData[0]);
  const sensorId = ownerId + "_" + sensorNumber;

  if (sensorNumber % 10 === 0 && sensorNumber % 100 !== 0) {
    sensorData.push(TYPES_0F_EQUIPMENT.BOILER);
  } else if (sensorNumber % 100 === 0) {
    sensorData.push(TYPES_0F_EQUIPMENT.GATEWAY);
  } else {
    sensorData.push(TYPES_0F_EQUIPMENT.SENSOR);
  }
  sensorData.push(Date.now().toString());

  // Додавання та оновлення даних (у разі наявних)

  const keysOfSensorsResponses = Object.keys(sensorsResponses);

  if (!keysOfSensorsResponses.includes(ownerId)) {
    sensorsResponses[ownerId] = {
      [sensorId]: sensorData,
    };
  } else {
    keysOfSensorsResponses.forEach((key) => {
      if (key === ownerId) {
        sensorsResponses[ownerId][sensorId] = sensorData;
      }
    });
  }
  return sensorsResponses;
}

export function isNeedsAutoSorting(sensorsResponses: SensorsResponse) {
  const ownersIdArray = Object.keys(sensorsResponses);
  for (let ownerId of ownersIdArray) {
    const sensorsIdArray = Object.keys(sensorsResponses[ownerId]);
    //   Array of all sensors excluding boilers and gateways
    let arrayOfSensors: string[] = [];
    for (let sensorId of sensorsIdArray) {
      const number = sensorsResponses[ownerId][sensorId][0];
      if (!number.includes("0")) {
        arrayOfSensors.push(number);
      }
    }
    const allSensors: NodeListOf<Element> = document.querySelectorAll(
      `[data-sensor=${ownerId}] > [data-sensor='true']`
    );
    if (arrayOfSensors.length !== allSensors.length) {
      statesForSorting[ownerId] = true;
    } else {
      statesForSorting[ownerId] = false;
    }
  }
}
