export function temperatureAlarm(
  sensorId: string,
  temperatureOut: string,
  typeOfSensor: string
): void {
  if (typeOfSensor === "gateway") return;

  const currentSensor = document.getElementById(sensorId);
  const alarmHigh = Number(currentSensor?.dataset.high);
  const alarmLow = Number(currentSensor?.dataset.low);
  const currentTempreature = Number(temperatureOut);
  const monitorDiv = document.querySelector(
    "[data-is-alarm-active]"
  ) as HTMLDivElement;

  if (currentSensor) {
    if (currentTempreature === -127) {
      currentSensor?.classList.add("damaged");
      return;
    } else {
      currentSensor?.classList.remove("damaged");
    }
    if (
      alarmHigh < currentTempreature &&
      currentSensor.dataset.stopped !== "true"
    ) {
      currentSensor.classList.add("over-heated-alarm");
      currentSensor.dataset.blink = "true";
      monitorDiv.dataset.isAlarmActive = "true";
    } else if (
      alarmLow > currentTempreature &&
      currentSensor.dataset.stopped !== "true"
    ) {
      currentSensor?.classList.add("freezing-cold-alarm");
      currentSensor.dataset.blink = "true";
      monitorDiv.dataset.isAlarmActive = "true";
    } else if (
      alarmLow < currentTempreature &&
      alarmHigh > currentTempreature
    ) {
      currentSensor.dataset.stopped = "false";
      currentSensor.dataset.blink = "false";
      currentSensor?.classList.remove("freezing-cold-alarm");
      currentSensor?.classList.remove("over-heated-alarm");
      if (
        !monitorDiv.querySelector(".freezing-cold-alarm") &&
        !monitorDiv.querySelector(".over-heated-alarm")
      ) {
        monitorDiv.dataset.isAlarmActive = "false";
      }
    }
  }
}

// ==== Функція припинення блимання сигналізації

export function stopAlarm(event: Event): void {
  if (!(event.target as HTMLElement)?.dataset.stopAlarm) return;

  const alarmElements = document.querySelectorAll('[data-blink="true"]');
  const monitorDiv = document.querySelector(
    "[data-is-alarm-active]"
  ) as HTMLDivElement;
  monitorDiv.dataset.isAlarmActive = "false";
  alarmElements.forEach((el) => {
    (el as HTMLElement).dataset.stopped = "true";
    (el as HTMLElement).dataset.blink = "false";
  });
  stopAlarmSound();
}

// ==== Включення звукової сигналізації
export function startAlarmSound() {
  const monitorDiv = document.querySelector(".monitor") as HTMLDivElement;
  const isAlarmActive = monitorDiv.dataset.isAlarmActive;
  const isSoundPlaying = monitorDiv.dataset.isSoundPlaying;
  if (
    (isAlarmActive === "false" && isSoundPlaying === "false") ||
    (isAlarmActive === "true" && isSoundPlaying === "true")
  )
    return;

  const alarmSound = document.querySelector(
    "[data-alarm-sound]"
  ) as HTMLAudioElement;
  if (isAlarmActive === "true") {
    alarmSound.volume = 0.5;
    alarmSound.playbackRate = 1.2;
    alarmSound.loop = true;
    alarmSound.play();
    monitorDiv.dataset.isSoundPlaying = "true";
  }
}

export function stopAlarmSound() {
  const monitorDiv = document.querySelector(".monitor") as HTMLDivElement;
  const alarmSound = document.querySelector(
    "[data-alarm-sound]"
  ) as HTMLAudioElement;
  alarmSound.pause();
  alarmSound.currentTime = 0;
  alarmSound.loop = false;
  monitorDiv.dataset.isSoundPlaying = "false";
}
