type MapPointerActions = {
  enabled: () => boolean;
  beginDrag: () => void;
  pan: (dx: number, dy: number) => void;
  select: (x: number, y: number) => void;
};

/** Mouse input shared by the terrain canvas and its interactive city labels. */
export function bindMapPointer(
  root: HTMLElement,
  canvas: HTMLCanvasElement,
  actions: MapPointerActions,
) {
  let drag: {
    id: number;
    x: number;
    y: number;
    lastX: number;
    lastY: number;
    button: number;
    cityId?: string;
    moved: boolean;
  } | null = null;
  let suppressClick = false,
    clickTimer = 0;
  const mapTarget = (target: EventTarget | null) =>
    target instanceof Element &&
    (target === canvas || !!target.closest(".ocean-port"));
  const cleanup = () => {
    const active = drag;
    drag = null;
    root.classList.remove("map-dragging");
    if (active && root.hasPointerCapture(active.id))
      root.releasePointerCapture(active.id);
  };
  const down = (event: PointerEvent) => {
    if (
      !actions.enabled() ||
      event.pointerType === "touch" ||
      !mapTarget(event.target) ||
      drag ||
      event.button > 2
    )
      return;
    const label = (event.target as Element).closest<HTMLElement>(".ocean-port");
    drag = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      lastX: event.clientX,
      lastY: event.clientY,
      button: event.button,
      cityId: label?.dataset.oceanPort,
      moved: false,
    };
    // Capture on a stable ancestor: labels can be recycled while the map moves.
    root.setPointerCapture(event.pointerId);
    event.preventDefault();
    event.stopPropagation();
  };
  const move = (event: PointerEvent) => {
    if (!drag || drag.id !== event.pointerId) return;
    event.preventDefault();
    event.stopPropagation();
    if (
      !drag.moved &&
      Math.hypot(event.clientX - drag.x, event.clientY - drag.y) < 4
    )
      return;
    if (!drag.moved) {
      drag.moved = true;
      actions.beginDrag();
      root.classList.add("map-dragging");
    }
    actions.pan(event.clientX - drag.lastX, event.clientY - drag.lastY);
    drag.lastX = event.clientX;
    drag.lastY = event.clientY;
  };
  const up = (event: PointerEvent) => {
    if (!drag || drag.id !== event.pointerId) return;
    const active = drag;
    // A release can be the first large displacement if pointer events were coalesced.
    if (
      !active.moved &&
      Math.hypot(event.clientX - active.x, event.clientY - active.y) >= 4
    ) {
      active.moved = true;
      actions.beginDrag();
      actions.pan(event.clientX - active.lastX, event.clientY - active.lastY);
    }
    cleanup();
    event.preventDefault();
    event.stopPropagation();
    suppressClick = true;
    window.clearTimeout(clickTimer);
    clickTimer = window.setTimeout(() => {
      suppressClick = false;
    }, 0);
    if (!active.moved && active.button === 0) {
      if (active.cityId) {
        // Keep the existing button action, including switching an open drawer.
        root
          .querySelector<HTMLButtonElement>(
            `[data-ocean-port="${CSS.escape(active.cityId)}"]`,
          )
          ?.click();
      } else actions.select(event.clientX, event.clientY);
    }
  };
  const cancel = (event: PointerEvent) => {
    if (drag?.id === event.pointerId) cleanup();
  };
  const click = (event: MouseEvent) => {
    if (
      suppressClick &&
      event.detail > 0 &&
      (event.target === root || mapTarget(event.target))
    ) {
      event.preventDefault();
      event.stopPropagation();
      suppressClick = false;
    }
  };
  const wheel = (event: WheelEvent) => {
    if (
      !actions.enabled() ||
      !(event.target instanceof Element) ||
      !event.target.closest(".ocean-port")
    )
      return;
    event.preventDefault();
    event.stopPropagation();
    canvas.dispatchEvent(
      new WheelEvent("wheel", {
        bubbles: true,
        cancelable: true,
        clientX: event.clientX,
        clientY: event.clientY,
        deltaX: event.deltaX,
        deltaY: event.deltaY,
        deltaMode: event.deltaMode,
        ctrlKey: event.ctrlKey,
      }),
    );
  };
  const context = (event: MouseEvent) => {
    if (actions.enabled() && (event.target === root || mapTarget(event.target)))
      event.preventDefault();
  };
  root.addEventListener("pointerdown", down, true);
  root.addEventListener("pointermove", move, true);
  root.addEventListener("pointerup", up, true);
  root.addEventListener("pointercancel", cancel, true);
  root.addEventListener("lostpointercapture", cancel, true);
  root.addEventListener("click", click, true);
  root.addEventListener("wheel", wheel, { capture: true, passive: false });
  root.addEventListener("contextmenu", context);
  window.addEventListener("blur", cleanup);
  return () => {
    cleanup();
    window.clearTimeout(clickTimer);
    root.removeEventListener("pointerdown", down, true);
    root.removeEventListener("pointermove", move, true);
    root.removeEventListener("pointerup", up, true);
    root.removeEventListener("pointercancel", cancel, true);
    root.removeEventListener("lostpointercapture", cancel, true);
    root.removeEventListener("click", click, true);
    root.removeEventListener("wheel", wheel, true);
    root.removeEventListener("contextmenu", context);
    window.removeEventListener("blur", cleanup);
  };
}
