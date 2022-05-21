import {
  Behavior,
  GameObject,
  isKeyClicked,
  Keys,
  Renderable,
  SimplifiedScene,
  Vec2d,
} from "../../engine";

import { createHUD, HUD } from "./HUD";
import { createIcePaddle, createSlimePaddle } from "./Padle";
import { createBall } from "./Ball";

export function pong() {
  const scene = new SimplifiedScene(100, 50);

  const gameComponents = new GameObject();

  const { hud, hudGameObject } = createHUD();
  scene.add(hudGameObject);

  gameComponents.add(buildLimits());
  gameComponents.add(createIcePaddle(15, 270, Keys.W, Keys.S));
  gameComponents.add(createSlimePaddle(85, 90, Keys.Up, Keys.Down));
  gameComponents.add(createBall(hud));

  scene.add(gameComponents);
  scene.add(pauseBehavior(gameComponents, hud));

  return scene;
}

const buildLimits = () => {
  const top = GameObject.build()
    .add(Renderable.build())
    .withRigidRectangle(Vec2d.from(90, 1), { mass: 0 })
    .setTransform({
      position: Vec2d.from(50, 45),
      scale: Vec2d.from(90, 1),
    }).gameObject;

  const bottom = GameObject.build()
    .add(Renderable.build())
    .withRigidRectangle(Vec2d.from(90, 1), { mass: 0 })
    .setTransform({
      position: Vec2d.from(50, 5),
      scale: Vec2d.from(90, 1),
    }).gameObject;

  const left = GameObject.build()
    .add(Renderable.build())
    .withBoundingBox("point1", Vec2d.from(2, 1))
    .withRigidRectangle(Vec2d.from(1, 41), { mass: 0 })
    .setTransform({
      position: Vec2d.from(5, 25),
      scale: Vec2d.from(1, 41),
    }).gameObject;

  const right = GameObject.build()
    .add(Renderable.build())
    .withBoundingBox("point2", Vec2d.from(2, 1))
    .withRigidRectangle(Vec2d.from(1, 41), { mass: 0 })
    .setTransform({
      position: Vec2d.from(95, 25),
      scale: Vec2d.from(1, 41),
    }).gameObject;

  const limits = new GameObject();
  limits.add(top);
  limits.add(bottom);
  limits.add(left);
  limits.add(right);
  return limits;
};

const pauseBehavior = (gameComponents: GameObject, hud: HUD) => {
  const pauseObject = new GameObject();

  pauseObject.add(
    new Behavior(() => {
      if (isKeyClicked(Keys.Space)) {
        gameComponents.paused = !gameComponents.paused;
        hud.togglePause();
      }
    })
  );

  return pauseObject;
};
