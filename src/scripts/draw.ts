import {
  type Coordinate,
  type Vector,
  easeInExpo,
  getVectorMagnitude,
  interpolate,
} from "../scripts/utils.ts";

// -- Dots board

export function drawDotsBoard(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  getNoise: (coordinate: Coordinate) => number,
  cursorPos?: Coordinate,
  dotMaxSize?: number,
  cellSize: number = 20
) {
  dotMaxSize = dotMaxSize ?? cellSize / 3;

  const cssComputedStyle = getComputedStyle(ctx.canvas);
  const darkPrimaryHex = cssComputedStyle.getPropertyValue("--dark-primary");
  const bluePrimaryHex = cssComputedStyle.getPropertyValue("--blue-primary");

  for (let y = 0; y < height; y += cellSize) {
    for (let x = 0; x < width; x += cellSize) {
      const noise = getNoise({ x, y }) + 0.1;
      let opacity = 1;
      /*
      let dotSize = Math.max((easeInExpo(noise) * dotMaxSize) / 2, 0.1);
      ctx.fillStyle = `rgb(from ${darkPrimaryHex} r g b / ${opacity}%)`;
      */
      let dotSize = 1.25;
      const color = noise * 360 * 1.5;
      ctx.fillStyle = `hsla(${color} 100 50 / 60%)`;

      if (cursorPos) {
        const cursorRad = 500;
        const dVector = { x: x - cursorPos.x, y: y - cursorPos.y };
        const hoveredDotMaxSize = dotMaxSize * 0.3;
        // 0 ... 1 based on distance to cursor, with negative means out of distance
        const strength = easeInExpo(
          1 - getVectorMagnitude(dVector) / cursorRad
        );
        if (strength >= 0) {
          const dotSizeFromCursor = interpolate(0, hoveredDotMaxSize, strength);
          if (dotSize <= dotSizeFromCursor) {
            opacity = strength * 100;
            /*
            ctx.fillStyle = `rgb(from ${bluePrimaryHex} r g b / ${opacity}%)`;
            */
            ctx.fillStyle =  `hsla(${color} 100 50 / ${opacity}%)`;
            dotSize = dotSizeFromCursor;

          }
        }
      }

      ctx.beginPath();
      ctx.arc(x - dotSize, y - dotSize, dotSize, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
