import { SensorsResponse } from "./login.types";
import { StatesForSorting } from "./sorting.types";

export function sorting(
  sensorsResponses: SensorsResponse,
  statesForSorting: StatesForSorting
) {
  const ownersNamesArray = Object.keys(sensorsResponses);
  for (let ownerName of ownersNamesArray) {
    // Array of NodeElements of sensors except boilers and gateways
    if (!statesForSorting[ownerName]) continue;

    //Sensors sorting

    const allSensorsArray: Element[] = [
      ...document.querySelectorAll(
        `[data-sensor=${ownerName}] > [data-sensor='true']`
      ),
    ].toSorted(
      (a, b) =>
        (a as HTMLElement).dataset?.name?.localeCompare(
          (b as HTMLElement).dataset?.name || ""
        ) || 0
    );

    const ownersControlAreaForSensors = document.querySelector(
      `[data-sensor=${ownerName}]`
    ) as HTMLDivElement;

    // Clear the container before appending new elements

    ownersControlAreaForSensors.innerHTML = "";

    // Append each sensor element to the container
    allSensorsArray.forEach((el) => {
      const element = el as HTMLDivElement;
      ownersControlAreaForSensors.appendChild(element);
    });

    // Boilers sorting

    const allBoilersArray: Element[] = [
      ...document.querySelectorAll(
        `[data-boiler=${ownerName}] > [data-boiler]`
      ),
    ].toSorted(
      (a, b) =>
        (a as HTMLElement).dataset?.name?.localeCompare(
          (b as HTMLElement).dataset?.name || ""
        ) || 0
    );

    const ownersControlAreaForBoilers = document.querySelector(
      `[data-boiler=${ownerName}]`
    ) as HTMLDivElement;

    // Clear the container before appending new elements

    ownersControlAreaForBoilers.innerHTML = "";

    // Append each sensor element to the container
    allBoilersArray.forEach((el) => {
      ownersControlAreaForBoilers.appendChild(el);
    });
  }
}

export function simpleSorting(ownerName: string): void {
  const allSensorsArray: Element[] = [
    ...document.querySelectorAll(
      `[data-sensor=${ownerName}] > [data-sensor="true"]`
    ),
  ].toSorted(
    (a, b) =>
      (a as HTMLElement).dataset?.name?.localeCompare(
        (b as HTMLElement).dataset?.name || ""
      ) || 0
  );

  const ownersControlAreaForSensors = document.querySelector(
    `[data-sensor=${ownerName}]`
  ) as HTMLDivElement;

  // Clear the container before appending new elements

  ownersControlAreaForSensors.innerHTML = "";

  // Append each sensor element to the container
  allSensorsArray.forEach((el) => {
    ownersControlAreaForSensors.appendChild(el);
  });
}

export function simpleSortingBoilers(ownerName: string): void {
  const allBoilersArray: Element[] = [
    ...document.querySelectorAll(`[data-boiler=${ownerName}] > [data-boiler]`),
  ].toSorted(
    (a, b) =>
      (a as HTMLElement).dataset?.name?.localeCompare(
        (b as HTMLElement).dataset?.name || ""
      ) || 0
  );

  const ownersControlAreaForBoilers = document.querySelector(
    `[data-boiler=${ownerName}]`
  ) as HTMLDivElement;

  // Clear the container before appending new elements

  ownersControlAreaForBoilers.innerHTML = "";

  // Append each sensor element to the container
  allBoilersArray.forEach((el) => {
    ownersControlAreaForBoilers.appendChild(el);
  });
}
