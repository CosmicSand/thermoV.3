// Функція оновлення значення заряду батареї

export function updateBatteryLevel(sensorId: string, chargingLevel: string) {
  const battery = document.querySelector(
    `.battery[data-battery-id=${sensorId}]`
  ) as HTMLDivElement;
  if (battery?.dataset.battery == null) return;
  const currentBatteryLevel = parseFloat(battery.dataset.battery);
  if (currentBatteryLevel === batteryLevel(chargingLevel)) return;
  battery.dataset.battery = batteryLevel(chargingLevel).toString();
}
//  Функція для індикації заряду батареї

export function batteryLevelShow(sensorId: string) {
  // Зроблено для перегляду всіх користувачів. Працює і для одного. Якщо суто для одного робити - то масив ти цикл зайві

  const battery = document.querySelector(
    `.battery[data-battery-id=${sensorId}]`
  ) as HTMLDivElement;

  if (battery?.dataset.battery == null) return;

  const batteryLevel = parseFloat(battery.dataset.battery);

  const redLevel = document.querySelector(
    `[data-red='${sensorId}']`
  ) as HTMLDivElement;

  const yellowLevel = document.querySelector(
    `[data-yellow='${sensorId}']`
  ) as HTMLDivElement;
  const greenLevel = document.querySelector(
    `[data-green='${sensorId}']`
  ) as HTMLDivElement;
  // document.querySelector(".medium-level") as HTMLDivElement;

  if (batteryLevel !== 0) {
    battery?.classList.remove("empty");
  }

  if (batteryLevel === 0) {
    redLevel?.classList.add("drained");
    yellowLevel?.classList.add("drained");
    greenLevel?.classList.add("drained");
    battery?.classList.add("empty");
    return;
  }
  if (batteryLevel < 20) {
    redLevel?.classList.remove("drained");
    redLevel?.classList.remove("medium-level");
    yellowLevel?.classList.add("drained");
    greenLevel?.classList.add("drained");
    return;
  }
  if (batteryLevel >= 20 && batteryLevel < 70) {
    redLevel?.classList.remove("drained");
    redLevel?.classList.remove("is-full");
    redLevel?.classList.add("medium-level");
    yellowLevel?.classList.remove("drained");
    yellowLevel?.classList.remove("is-full");
    greenLevel?.classList.add("drained");
    return;
  }
  if (batteryLevel >= 70) {
    redLevel?.classList.remove("drained");
    redLevel?.classList.add("is-full");
    yellowLevel?.classList.remove("drained");
    yellowLevel?.classList.add("is-full");
    greenLevel?.classList.remove("drained");
    return;
  }
}

//   Функція конвертації напруги батареї у відсотки. За замовчанням в якості аргументів передаються значення  fullBattery = 4.5, emptyBattery= 3.2  - що справедливо для всіх сенсорів окрім gateway, для якого потрібно передавати під час виклику значення fullBattery = 4.2, emptyBattery= 3.6

export function batteryLevel(
  chargingLevel: string,
  fullBattery: number = 4.5,
  emptyBattery: number = 3.2
) {
  const currentBatteryLevel = (
    100 -
    ((fullBattery - parseFloat(chargingLevel)) * 100) /
      (fullBattery - emptyBattery)
  ).toFixed(0);
  if (!currentBatteryLevel.includes("-")) {
    return parseInt(currentBatteryLevel) > 100
      ? 100
      : parseInt(currentBatteryLevel);
  } else {
    return 0;
  }
}
