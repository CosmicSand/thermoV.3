import { startAlarmSound, stopAlarmSound, temperatureAlarm } from "./alarm";
import { modalInputsEventListener } from "./listeners";
import { SavedSettings } from "./settings.types";

const SAVED_NEW_SETTINGS: SavedSettings =
  JSON.parse(localStorage.getItem("SAVED_NEW_SETTINGS") as string) ?? {};
const nameSettingsInput = document.querySelector("[data-current-name]");
const highSettingsInput = document.querySelector("[data-current-high]");
const lowSettingsInput = document.querySelector("[data-current-low]");
const timeSettingsInput = document.querySelector("[data-current-time]");
export const modalWindow = document.querySelector(
  "[data-modal]"
) as HTMLDialogElement;

// Функція відкриття та закриття індивідуального вікна налаштувань

export function openAndCloseIndividualSettings(event: Event): void {
  const sensorId = (event.target as HTMLElement)?.dataset.id;
  const currentName = (event.target as HTMLElement)?.dataset.name;
  if (!sensorId) return;

  const settingsForm = document.querySelector(
    "[data-settings-form]"
  ) as HTMLElement;

  settingsForm.dataset.target = sensorId;
  settingsForm.dataset.currentSensorName = currentName;
  const name = (event.target as HTMLElement)?.dataset.name || "";
  const high = (event.target as HTMLElement)?.dataset.high || "";
  const low = (event.target as HTMLElement)?.dataset.low || "";
  const alarmtime = (event.target as HTMLElement)?.dataset.alarmtime || "";

  (nameSettingsInput as HTMLInputElement).value = name;
  (highSettingsInput as HTMLInputElement).value = high;
  (lowSettingsInput as HTMLInputElement).value = low;
  (timeSettingsInput as HTMLInputElement).value = alarmtime;

  (modalWindow as HTMLDialogElement)?.showModal();
  const applyBtn = modalWindow.querySelector(
    "[data-apply-btn]"
  ) as HTMLButtonElement;
  applyBtn.disabled = true;
  modalInputsEventListener(name, high, low, alarmtime);
}

// Застосування налаштувань

export function applySettings(event: Event): void {
  // Застосування введенних налаштувань

  const sensorId = (event.target as HTMLElement)?.dataset.target;

  if (sensorId == undefined) return;

  const currentSensor = document.querySelector(
    `[data-id=${sensorId}]`
  ) as HTMLElement;
  // const ownerId = (currentSensor.closest(".control-area") as HTMLDivElement).id;
  const paragraphWithName =
    (currentSensor.querySelector(
      "[data-sensor-name]"
    ) as HTMLParagraphElement) ??
    (currentSensor.querySelector("[data-boiler-name]") as HTMLParagraphElement);
  const newSettings = {
    newName: (nameSettingsInput as HTMLInputElement).value,
    newHighLimit: (highSettingsInput as HTMLInputElement).value,
    newLowLimit: (lowSettingsInput as HTMLInputElement).value,
    newAlarmTime: (timeSettingsInput as HTMLInputElement).value,
    ownerId: (currentSensor.closest(".control-area") as HTMLDivElement).id,
    sensorId,
  };
  if (
    currentSensor.dataset.name === newSettings.newName &&
    currentSensor.dataset.high === newSettings.newHighLimit &&
    currentSensor.dataset.low === newSettings.newLowLimit &&
    currentSensor.dataset.alarmtime === newSettings.newAlarmTime
  ) {
    return;
  }

  currentSensor.dataset.name = newSettings.newName;
  paragraphWithName.innerText = newSettings.newName;
  currentSensor.dataset.high = newSettings.newHighLimit;
  currentSensor.dataset.low = newSettings.newLowLimit;
  currentSensor.dataset.alarmtime = newSettings.newAlarmTime;

  saveSettings(newSettings);

  if (currentSensor.dataset.sensor && currentSensor.dataset.current) {
    const temperature = currentSensor.dataset.current;
    temperatureAlarm(sensorId, temperature, "sensor");
    startAlarmSound();
  }
  if (currentSensor.dataset.boiler && currentSensor.dataset.after) {
    const temperature = currentSensor.dataset.after;
    temperatureAlarm(sensorId, temperature, "boiler");
    startAlarmSound();
  }
  if (document.querySelectorAll("[data-blink=true]").length === 0) {
    stopAlarmSound();
  }
  modalWindow?.close();
}

function saveSettings({
  ownerId,
  sensorId,
  newName,
  newHighLimit,
  newLowLimit,
  newAlarmTime,
}: {
  ownerId: string;
  sensorId: string;
  newName: string;
  newHighLimit: string;
  newLowLimit: string;
  newAlarmTime: string;
}) {
  if (SAVED_NEW_SETTINGS[ownerId]?.[sensorId] == undefined) {
    SAVED_NEW_SETTINGS[ownerId] = {
      ...SAVED_NEW_SETTINGS[ownerId],
      [sensorId]: {
        newName,
        newHighLimit,
        newLowLimit,
        newAlarmTime,
        oldName: sensorId.slice(-1, sensorId.indexOf("-")),
      },
    };
  }
  if (SAVED_NEW_SETTINGS[ownerId] != undefined) {
    SAVED_NEW_SETTINGS[ownerId][sensorId] = {
      newName,
      newHighLimit,
      newLowLimit,
      newAlarmTime,
    };
  }
  localStorage.setItem(
    "SAVED_NEW_SETTINGS",
    JSON.stringify(SAVED_NEW_SETTINGS)
  );
}
