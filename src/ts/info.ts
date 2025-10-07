export function swipingPressingLoginBtn(event: Event) {
  const loginArea = document.querySelector(".login") as HTMLDivElement;
  const infoArea = document.querySelector(".greetings") as HTMLDivElement;
  const loginBtn = document.querySelector(
    "[data-login-form]"
  ) as HTMLButtonElement;

  if (event.target !== loginBtn) return;
  loginArea?.classList.add("anime");
  loginArea?.addEventListener("animationend", () => {
    loginArea?.classList.add("hidden");
    loginArea?.classList.remove("anime");
    infoArea?.classList.remove("hidden");
  });
}
export function swipingPressingBtns(event: Event) {
  const greetingsFirstPart = document.querySelector(
    "[data-first-part]"
  ) as HTMLDivElement;
  const greetingsSecondPart = document.querySelector(
    "[data-second-part]"
  ) as HTMLDivElement;
  const monitorArea = document.querySelector(
    "[data-monitor-section]"
  ) as HTMLDivElement;
  const infoArea = document.querySelector(".greetings") as HTMLDivElement;
  const nextBtn = document.querySelector("[data-next-button]");
  const letsRollBtn = document.querySelector("[data-roll-button]");

  switch (event.target) {
    case nextBtn:
      greetingsFirstPart?.classList.add("anime");
      greetingsFirstPart?.addEventListener(
        "animationend",
        () => {
          greetingsFirstPart?.classList.add("hidden");
          greetingsFirstPart?.classList.remove("anime");
          greetingsSecondPart?.classList.remove("hidden");
        },
        { once: true }
      );
      break;
    case letsRollBtn:
      infoArea?.classList.add("anime");
      infoArea?.addEventListener(
        "animationend",
        () => {
          infoArea?.classList.add("hidden");
          infoArea?.classList.remove("anime");
          monitorArea?.classList.add("anime");

          monitorArea?.classList.remove("hidden");
        },
        { once: true }
      );
      monitorArea?.addEventListener(
        "animationend",
        () => {
          monitorArea?.classList.remove("anime");
        },
        { once: true }
      );
      break;
  }
}
