import "../styles/style.css";
import { drawDotsBoard } from "./draw";
import { type Coordinate, animationLoop } from "./utils";
import { generateNoise } from "./perlin-noise";

// -- Control

const drawDotsBoardControl = document.getElementById(
  "draw-dots"
) as HTMLInputElement;
const enableRotationControl = document.getElementById(
  "enable-rotation"
) as HTMLInputElement;
const enableInteractionControl = document.getElementById(
  "enable-interaction"
) as HTMLInputElement;

let shouldDrawDotBoard = drawDotsBoardControl.checked;
let enableRotation = enableRotationControl.checked;
let enableInteraction = enableInteractionControl.checked;


drawDotsBoardControl.addEventListener(
  "change",
  () => (shouldDrawDotBoard = drawDotsBoardControl.checked)
);
enableRotationControl.addEventListener(
  "change",
  () => (enableRotation = enableRotationControl.checked)
);
enableInteractionControl.addEventListener(
  "change",
  () => (enableInteraction = enableInteractionControl.checked)
);

// -- SETUP

const NOISE_CELL_SIZE = 200;

let width = 400 * window.devicePixelRatio;
let height = 180 * window.devicePixelRatio;

const canvasElement = document.getElementById(
  "background-canvas"
) as HTMLCanvasElement;
const ctx = canvasElement.getContext("2d")!;

// Responsive canvas while maintaining pixel density for retina display
const resizeCanvas = (width: number, height: number) => {
  canvasElement.width = width * window.devicePixelRatio;
  canvasElement.height = height * window.devicePixelRatio;

  ctx.scale(devicePixelRatio, window.devicePixelRatio);
};

const resizeObserverCallback = (entries: ResizeObserverEntry[]) => {
  for (const entry of entries) {
    width = entry.contentRect.width;
    height = entry.contentRect.height;
    resizeCanvas(width, height);
  }
};
const resizeObserver = new ResizeObserver(resizeObserverCallback);
resizeObserver.observe(canvasElement);

// Perlin Noise

const { randomRotateGradients, getGradient, getNoise } = generateNoise();

function getNoiseNormalised(coord: Coordinate) {
  return getNoise({
    x: coord.x / NOISE_CELL_SIZE/2,
    y: coord.y / NOISE_CELL_SIZE/2,
  });
}

// Tracking mouse position

const cursorPos = { x: 0, y: 0 };
window.addEventListener("mousemove", (e) => {
  const { x, y } = canvasElement.getBoundingClientRect();
  cursorPos.x = e.clientX - x;
  cursorPos.y = e.clientY - y;
});

// -- ANIMATION

animationLoop(() => {
  const perlinNoiseMapWidth = Math.ceil(width / NOISE_CELL_SIZE);
  const perlinNoiseMapHeight = Math.ceil(height / NOISE_CELL_SIZE);

  ctx.clearRect(0, 0, width, height);

  if (shouldDrawDotBoard) {
    drawDotsBoard(
      ctx,
      width,
      height,
      getNoiseNormalised,
      enableInteraction ? cursorPos : undefined,
      10,
      20
    );
  }

  if (enableRotation) {
    randomRotateGradients(
      perlinNoiseMapWidth,
      perlinNoiseMapHeight,
      Math.PI / 100
    );
  }
});
