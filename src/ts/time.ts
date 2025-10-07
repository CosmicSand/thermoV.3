const intObj: { [key: string]: NodeJS.Timeout } = {};

export function timeSinceLastUpd(sensorId: string, timeStamp: string) {
  // const updateTime = Number(arrayOfParameters[8]);
  const currentSensor = document.getElementById(sensorId);
  const currentTauBtn = document.querySelector(`#${sensorId} .tau`);
  const alarm = currentSensor?.dataset.alarmtime;

  if (intObj[sensorId]) {
    clearInterval(intObj[sensorId]);
  }

  const interval = setInterval(() => {
    const timeLeft = (Date.now() - Number(timeStamp)) / (1000 * 60);
    if (alarm && timeLeft > Number(alarm)) {
      (currentTauBtn as HTMLElement).innerText = (timeLeft - 0.5).toFixed(0);
      (currentTauBtn as HTMLElement).dataset.tau = (timeLeft - 0.5).toFixed(1);
      currentTauBtn?.classList.remove("hidden");
      currentSensor.classList.add("sensor-time-alarm");
    } else {
      currentTauBtn?.classList.add("hidden");
      currentSensor?.classList.remove("sensor-time-alarm");
    }
  }, 10000);

  intObj[sensorId] = interval;
}
