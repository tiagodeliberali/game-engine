import { Vec2d } from "..";

let mSystemAcceleration = Vec2d.from(30, -50.0);

const getSystemAcceleration = () => {
  return mSystemAcceleration;
};

const setSystemAcceleration = (x: number, y: number) => {
  mSystemAcceleration = Vec2d.from(x, y);
};

export { getSystemAcceleration, setSystemAcceleration };
