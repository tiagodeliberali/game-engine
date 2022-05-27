import { Vec2d } from "../DataStructures";

export type PhysicsSettings = {
  velocity?: Vec2d;
  acceleration?: Vec2d;
  mass?: number;
  inertia?: number;
  friction?: number;
  restitution?: number;
  angularVelocity?: number;
  disableRotation?: boolean;
};
