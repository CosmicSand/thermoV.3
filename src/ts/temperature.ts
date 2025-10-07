// Функція, яка оновлює значення температури датчиків

export function sensorsTemperatureUpdate(
  sensorId: string,
  temperature: string,
  typeOfSensor: string
) {
  if (typeOfSensor !== "sensor") return;
  const sensorTemperature = parseFloat(temperature);
  const currentSensor = document.querySelector(
    `[data-id='${sensorId}']`
  ) as HTMLDivElement;
  const currentTemperatureParagraph = document.querySelector(
    `[data-temp='${sensorId}']`
  ) as HTMLParagraphElement;
  if (sensorTemperature === -127) currentTemperatureParagraph.innerText = "!";
  if (currentTemperatureParagraph.innerText != null) {
    let currentTemperature = parseFloat(currentTemperatureParagraph.innerText);
    if (
      currentTemperature !== sensorTemperature &&
      sensorTemperature !== -127
    ) {
      currentTemperatureParagraph.innerText = sensorTemperature.toFixed(1);
      currentSensor.dataset.current = sensorTemperature.toFixed(1);
    }
  }
}

// Функція, яка оновлює значення температур котла

export function boilerTemperatureUpdate(
  sensorId: string,
  temperatureIn: string,
  temperatureOut: string,
  typeOfSensor: string
) {
  if (typeOfSensor !== "boiler") return;
  const temperatureBefore = parseFloat(temperatureIn);
  const temperatureAfter = parseFloat(temperatureOut);
  const currentBoiler = document.querySelector(
    `[data-boiler = ${sensorId}]`
  ) as HTMLDivElement;

  if (temperatureBefore === -127) currentBoiler.dataset.before = "!";
  if (currentBoiler.dataset.before != null) {
    let currentTemperatureBefore = parseFloat(currentBoiler.dataset.before);
    if (
      currentTemperatureBefore !== parseFloat(temperatureBefore.toFixed(1)) &&
      temperatureBefore !== -127
    ) {
      currentBoiler.dataset.before = temperatureBefore.toFixed(1);
    }
  }

  if (temperatureAfter === -127) currentBoiler.dataset.after = "!";
  if (currentBoiler.dataset.after != null) {
    let currentTemperatureAfter = parseFloat(currentBoiler.dataset.after);
    if (
      currentTemperatureAfter !== temperatureAfter &&
      temperatureAfter !== -127
    ) {
      currentBoiler.dataset.after = temperatureAfter.toFixed(1);
    }
  }
}
