// Функція оновлення значення сигналу

export function updateSignalLevel(sensorId: string, signal: string) {
  const signalDiv = document.querySelector(
    `.signal[data-signal-id=${sensorId}]`
  ) as HTMLDivElement;
  if (signalDiv?.dataset.signalLevel == null) return;
  const currentSignalLevel = parseInt(signalDiv.dataset.signalLevel);
  if (currentSignalLevel === signalLevel(signal)) return;
  signalDiv.dataset.signalLevel = signalLevel(signal).toString();
}

//  Функція для індикації сигналу батареї

export function signalLevelShow(sensorId: string) {
  const signalDiv = document.querySelector(
    `[data-signal-id=${sensorId}]`
  ) as HTMLDivElement;
  const signalLevel = Number(signalDiv?.dataset.signalLevel);

  if (signalLevel == null) return;
  if (signalLevel === 0) {
    signalDiv?.classList.remove("poor-signal");
    signalDiv?.classList.add("no-signal");
    return;
  }
  if (signalLevel < 20) {
    signalDiv?.classList.remove("no-signal");
    signalDiv.classList.add("poor-signal");
    signalDiv.classList.remove("average-signal");
    return;
  }
  if (signalLevel >= 20 && signalLevel < 70) {
    signalDiv?.classList.remove("no-signal");
    signalDiv.classList.add("average-signal");
    signalDiv.classList.remove("poor-signal");
    return;
  }
  if (signalLevel >= 70) {
    signalDiv?.classList.remove("no-signal");
    signalDiv.classList.remove("average-signal");
    signalDiv.classList.remove("poor-signal");
    return;
  }
}

// Розрахунок сигналу передавання даних. Сигнал змінюється в діапазоні від -30 (поганий сигнал) до -120 (максимальний)

export function signalLevel(
  signal: string,
  lowSignal: number = -120,
  highSignal: number = -30
) {
  const currentBatteryLevel = (
    100 -
    ((highSignal - parseInt(signal)) * 100) / (highSignal - lowSignal)
  ).toFixed(0);
  return parseInt(currentBatteryLevel);
}
