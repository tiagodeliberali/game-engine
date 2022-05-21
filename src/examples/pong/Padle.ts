import {
  GameObject,
  isKeyPressed,
  Keys,
  TextureRenderable,
  Vec2d,
} from "../../engine";

// https://craftpix.net/freebies/free-buttons-2d-game-objects/
const icePaddlePath = "./textures/ice_paddle.png";
const slimePaddlePath = "./textures/slime_paddle.png";

export const createIcePaddle = (
  x: number,
  rotation: number,
  upKey: Keys,
  downKey: Keys
) => {
  return createPaddle(icePaddlePath, x, rotation, upKey, downKey);
};

export const createSlimePaddle = (
  x: number,
  rotation: number,
  upKey: Keys,
  downKey: Keys
) => {
  return createPaddle(slimePaddlePath, x, rotation, upKey, downKey);
};

const createPaddle = (
  texturePath: string,
  x: number,
  rotation: number,
  upKey: Keys,
  downKey: Keys
) => {
  return GameObject.build()
    .add(
      TextureRenderable.build(texturePath).setTransform({
        scale: Vec2d.from(13, 5),
        rotationInDegree: rotation,
      })
    )
    .withRigidRectangle(Vec2d.from(3, 11), { mass: 100 })
    .withBehavior((helper) => {
      const body = helper.lastRigidShape;
      const speed = 60;

      if (body === undefined) {
        return;
      }

      body.mVelocity = Vec2d.from(0, 0);

      if (
        isKeyPressed(upKey) &&
        helper.gameObject.getTransform().getPosition().y < 39
      ) {
        body.mVelocity = Vec2d.from(0, speed);
      } else if (
        isKeyPressed(downKey) &&
        helper.gameObject.getTransform().getPosition().y > 11
      ) {
        body.mVelocity = Vec2d.from(0, -speed);
      }
    })
    .setTransform({ position: Vec2d.from(x, 25) }).gameObject;
};
