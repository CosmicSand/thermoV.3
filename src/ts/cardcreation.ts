import { SensorsResponse } from "./login.types";
import {
  sensorsTemperatureUpdate,
  boilerTemperatureUpdate,
} from "./temperature";
import { startAlarmSound, temperatureAlarm } from "./alarm";
import { timeSinceLastUpd } from "./time";
import { updateBatteryLevel, batteryLevelShow, batteryLevel } from "./battery";
import { signalLevelShow, signalLevel, updateSignalLevel } from "./signal";

// const intObj: { [key: string]: NodeJS.Timeout } = {};
const monitor = document.querySelector(".monitor") as HTMLDivElement;

export function cardCreation(sensorsResponses: SensorsResponse) {
  const ownersIdArray = Object.keys(sensorsResponses);

  // Створюємо контейнери для сенсорів

  for (let ownerId of ownersIdArray) {
    const divIdExistence = document.getElementById(ownerId);

    if (!divIdExistence) {
      monitor?.insertAdjacentHTML(
        "afterbegin",
        `<div class='control-area' id=${ownerId}><h2>${ownerId}</h2><div class="gateway" data-gateway=${ownerId}></div><div class="for-boilers" data-boiler=${ownerId}></div><div class="for-sensors" data-sensor=${ownerId}></div></div>`
      );
    }

    // Малюємо сенсори

    const sensorsIdArray = Object.keys(sensorsResponses[ownerId]);

    for (let sensorId of sensorsIdArray) {
      const ownersControlArea = document.getElementById(
        ownerId
      ) as HTMLDivElement;
      let [
        name,
        chargingLevel,
        temperatureOut,
        temperatureIn,
        signal,
        ,
        typeOfSensor,
        timeStamp,
      ] = sensorsResponses[ownerId][sensorId];

      // name = checkForSavedSettings(ownerId, sensorId) || name;
      // console.log(name, sensorId);

      // const arrayOfParameters = sensorsResponses[ownerId][sensorId] as string[];
      const idCheckEl = document.getElementById(sensorId);
      // const temperature = Number(arrayOfParameters[1]).toFixed(1);
      const isSensor = typeOfSensor.includes("sensor");
      const isBoiler = typeOfSensor.includes("boiler");
      const isGateway = typeOfSensor.includes("gateway");

      if (!ownersControlArea.contains(idCheckEl) && isSensor) {
        const ownersControlAreaForSensors = document.querySelector(
          `[data-sensor=${ownerId}]`
        ) as HTMLDivElement;

        const sensorElement = `<div class="sensor" data-sensor="true" data-id='${sensorId}' data-name=${
          applySavedSettings(ownerId, sensorId)?.newName || name
        } id='${sensorId}'  data-alarmtime=${
          applySavedSettings(ownerId, sensorId)?.newAlarmTime || "3"
        }  data-high=${
          applySavedSettings(ownerId, sensorId)?.newHighLimit || "85"
        } data-low=${
          applySavedSettings(ownerId, sensorId)?.newLowLimit || "15"
        } data-current=${temperatureOut}>
            <p class="parameter"  data-temp='${sensorId}'>${temperatureOut}</p>
            <p class="sensor-name" data-sensor-name>${
              applySavedSettings(ownerId, sensorId)?.newName || name
            }</p>
            
            <div class="signal" data-signal-id='${sensorId}' data-signal-level=${signalLevel(
          signal
        )}>
             <div class="signal-dot"></div>
              <div class="signal-dot"></div>
              <div class="signal-dot"></div>
            </div>
            <div class="battery" data-battery-id='${sensorId}' data-battery=${batteryLevel(
          chargingLevel
        )}>
             <div class="low-level" data-red=${sensorId}></div>
              <div class="medium-level drained" data-yellow=${sensorId}></div>
              <div class="full-level drained" data-green=${sensorId}></div>
            </div>
              <div class="tau hidden" data-tau="">
               &#120533;
            </div>
          </div>`;
        ownersControlAreaForSensors.insertAdjacentHTML(
          "beforeend",
          sensorElement
        );
      } else if (!ownersControlArea.contains(idCheckEl) && isBoiler) {
        const ownersControlAreaForBoilers = document.querySelector(
          `[data-boiler=${ownerId}]`
        ) as HTMLDivElement;

        const temperatureAfter = parseFloat(temperatureOut);
        const temperatureBefore = parseFloat(temperatureIn);
        // !outTemperature.toString().includes("-")

        // Розрахунок підігріву
        // let delta: string;
        // if (temperatureAfter > 0 && temperatureBefore > 0) {
        //   delta = (temperatureAfter - temperatureBefore).toFixed(1);
        // } else {
        //   delta = "";
        // }

        const sensorBoilerElement = `<div class="boiler" id=${sensorId} data-id=${sensorId}  data-name=${
          applySavedSettings(ownerId, sensorId)?.newName || name
        } data-boiler=${sensorId} data-before=${
          temperatureBefore > 0 ? temperatureBefore : "!"
        } data-after=${
          temperatureAfter > 0 ? temperatureAfter : "!"
        } data-active=${boilerIsActive(
          temperatureBefore,
          temperatureAfter
        )} data-alarmtime=${
          applySavedSettings(ownerId, sensorId)?.newAlarmTime || "3"
        }  data-high=${
          applySavedSettings(ownerId, sensorId)?.newHighLimit || "85"
        } data-low=${
          applySavedSettings(ownerId, sensorId)?.newLowLimit || "15"
        }>
                        <div class="temperature-wrapper" data-before=${
                          temperatureBefore > 0 ? temperatureBefore : "!"
                        }> <p class="parameter" >${temperatureAfter}</p> </div>
                      
            <p class="sensor-name" data-boiler-name>
              
            ${applySavedSettings(ownerId, sensorId)?.newName || name}
            </p>
<div class="signal" data-signal-id='${sensorId}' data-signal-level=${signalLevel(
          signal
        )}>
             <div class="signal-dot"></div>
              <div class="signal-dot"></div>
              <div class="signal-dot"></div>
            </div>
            <div class="battery" data-battery-id='${sensorId}' data-battery=${batteryLevel(
          chargingLevel
        )}>
              <div class="low-level" data-red=${sensorId}></div>
              <div class="medium-level drained" data-yellow=${sensorId}></div>
              <div class="full-level drained" data-green=${sensorId}></div>
            </div>
            <div class="tau hidden" data-tau="">
               &#120533;
            </div>
          </div>`;
        ownersControlAreaForBoilers.insertAdjacentHTML(
          "beforeend",
          sensorBoilerElement
        );
      } else if (!ownersControlArea.contains(idCheckEl) && isGateway) {
        const ownersControlAreaForGateway = document.querySelector(
          `[data-gateway=${ownerId}]`
        ) as HTMLDivElement;
        const sensorParameters = sensorsResponses[ownerId][
          sensorId
        ] as string[];
        const accuLevel = Number(chargingLevel);
        const isGrid = Number(sensorParameters[2]) > 4 ? 1 : 0;

        const sensorGatewayElement = `<div class="gateway-element" id='${sensorId}' data-accu=${accuLevel} data-grid=${isGrid} data-alarmtime="3">
                        <p class="parameter">${accuLevel}</p>
                        <p class="parameter">${isGrid}</p>
          

            <div class="battery" data-battery-id='${sensorId}' data-battery=${batteryLevel(
          chargingLevel,
          4.2,
          3.6
        )}>
              <div class="low-level" data-red=${sensorId}></div>
              <div class="medium-level drained" data-yellow=${sensorId}></div>
              <div class="full-level drained" data-green=${sensorId}></div>
            </div>
             <div class="tau hidden" data-tau="">
               &#120533;
            </div>
             </div>         
          `;
        ownersControlAreaForGateway.insertAdjacentHTML(
          "beforeend",
          sensorGatewayElement
        );
      }

      sensorsTemperatureUpdate(sensorId, temperatureOut, typeOfSensor);
      boilerTemperatureUpdate(
        sensorId,
        temperatureIn,
        temperatureOut,
        typeOfSensor
      );
      temperatureAlarm(sensorId, temperatureOut, typeOfSensor);
      startAlarmSound();
      updateBatteryLevel(sensorId, chargingLevel);
      batteryLevelShow(sensorId);
      updateSignalLevel(sensorId, signal);
      signalLevelShow(sensorId);
      timeSinceLastUpd(sensorId, timeStamp);
    }
  }
  console.log(sensorsResponses);
}

// Застосування класу isActive для котла, який знаходиться в роботі

function boilerIsActive(inTemperature: number, outTemperature: number) {
  if (outTemperature - inTemperature > 5 && outTemperature > 40) {
    return true;
  } else {
    return false;
  }
}

// Застосування збережених даних

function applySavedSettings(ownerId: string, sensorId: string) {
  if (localStorage.getItem("SAVED_NEW_SETTINGS") == undefined) return;
  const savedSettings = JSON.parse(
    localStorage.getItem("SAVED_NEW_SETTINGS") as string
  );
  if (ownerId in savedSettings && sensorId in savedSettings[ownerId])
    return savedSettings[ownerId][sensorId];
}
