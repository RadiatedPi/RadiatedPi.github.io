import { Map2D } from "./map-2d";
import {
  clamp,
  type Coordinate,
  getRandomUnitVector,
  interpolate,
  rotateVector,
  type Vector,
} from "./utils";

export function generateNoise() {
  const gradients = new Map2D<number, Vector>();
  const gradientsRotation = new Map2D<number, number>();

  function getGradient({ x, y }: Coordinate) {
    let gradient = gradients.get(x, y);
    if (!gradient) {
      gradient = getRandomUnitVector();
      gradients.set(x, y, gradient);
      gradientsRotation.set(x, y, 0);
    }

    return gradient;
  }


  function randomRotateGradients(
    width: number,
    height: number,
    maxRadian: number
  ) {
    for (let y = 0; y <= height; y++) {
      for (let x = 0; x <= width; x++) {
        const gradient = getGradient({ x, y });
        const rotation = gradientsRotation.get(x, y) ?? 0;
        const newRotation = clamp(
          -Math.PI / 50,
          Math.PI / 50,
          rotation + (Math.random() * 2 - 1) * maxRadian
        );

        gradients.set(x, y, rotateVector(gradient, newRotation));
        gradientsRotation.set(x, y, newRotation);
      }
    }
  }

  function dotProductGradient(coord: Coordinate, gradientCoord: Coordinate) {
    const gradient = getGradient(gradientCoord);
    const dx = coord.x - gradientCoord.x;
    const dy = coord.y - gradientCoord.y;
    const dVector = { x: dx, y: dy };

    return dVector.x * gradient.x + dVector.y * gradient.y;
  }

  /** returns -1 ... 1 */
  function getNoise(coord: Coordinate) {
    const { x, y } = coord;

    const topLeftGradX = Math.floor(x);
    const topLeftGradY = Math.floor(y);

    const topLeftGradientCoord = { x: topLeftGradX, y: topLeftGradY };
    const topRightGradientCoord = { x: topLeftGradX + 1, y: topLeftGradY };
    const bottomLeftGradientCoord = { x: topLeftGradX, y: topLeftGradY + 1 };
    const bottomRightGradientCoord = {
      x: topLeftGradX + 1,
      y: topLeftGradY + 1,
    };

    const sx = x - topLeftGradX;
    const sy = y - topLeftGradY;

    const dotTopLeft = dotProductGradient(coord, topLeftGradientCoord);
    const dotTopRight = dotProductGradient(coord, topRightGradientCoord);
    const topInterpolation = interpolate(dotTopLeft, dotTopRight, sx);

    const dotBottomLeft = dotProductGradient(coord, bottomLeftGradientCoord);
    const dotBottomRight = dotProductGradient(coord, bottomRightGradientCoord);
    const bottomInterpolation = interpolate(dotBottomLeft, dotBottomRight, sx);

    const noise = interpolate(topInterpolation, bottomInterpolation, sy);
    // interpolate -1 ... 1 to 0 ... 1
    const normaliseNoise = (noise + 1) / 2;

    return normaliseNoise;
  }

  return {
    getGradient,
    getNoise,
    randomRotateGradients,
  } as const;
}
