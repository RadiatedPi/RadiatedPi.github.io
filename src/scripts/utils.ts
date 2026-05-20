export interface Vector {
  x: number;
  y: number;
}

export interface Coordinate {
  x: number;
  y: number;
}

export function addVector(vectorA: Vector, vectorB: Vector): Vector {
  return {
    x: vectorA.x + vectorB.x,
    y: vectorA.y + vectorB.y,
  };
}

export function rotateVector(vector: Vector, rad: number) {
  return {
    x: Math.cos(rad) * vector.x - Math.sin(rad) * vector.y,
    y: Math.sin(rad) * vector.x + Math.cos(rad) * vector.y,
  };
}

export function getVectorMagnitude(vector: Vector) {
  return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
}

export function normaliseVector(vector: Vector) {
  const magnitude = getVectorMagnitude(vector);
  return { x: vector.x / magnitude, y: vector.y / magnitude };
}

export function getRandomUnitVector(): Vector {
  const theta = Math.random() * 2 * Math.PI;
  return { x: Math.cos(theta), y: Math.sin(theta) };
}

export function interpolate(min: number, max: number, val: number): number {
  return (
    (max - min) * ((val * (val * 6.0 - 15.0) + 10.0) * val * val * val) + min
  );
}

export function easeInExpo(x: number): number {
  return x === 0 ? 0 : Math.pow(2, 5 * x - 5);
}

export function clamp(min: number, max: number, value: number) {
  return Math.min(max, Math.max(value, min));
}

export function animationLoop(callback: () => void) {
  let previousTimeStamp = 0;
  let requestAnimationFrameId: number;

  const frameStep = (timeStamp: number) => {
    if (previousTimeStamp === 0) {
      previousTimeStamp = timeStamp;
    }

    // 60 fps
    const timePerFrame = (1 / 60) * 1000;
    // const timePerFrame = 50 * 1000;
    const delta = timeStamp - previousTimeStamp;
    if (delta >= timePerFrame) {
      previousTimeStamp = timeStamp;
      callback();
    }

    requestAnimationFrameId = requestAnimationFrame(frameStep);
  };

  requestAnimationFrameId = requestAnimationFrame(frameStep);

  return () => cancelAnimationFrame(requestAnimationFrameId);
}
