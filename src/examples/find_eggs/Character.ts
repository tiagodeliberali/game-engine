import {
  AnimationType,
  Camera,
  GameObject,
  isKeyClicked,
  Keys,
  Movement,
  SpriteRenderable,
  Vec2d,
  walk2d,
} from "../../engine";
import { Light } from "../../engine/graphics";
import { RigidCircle } from "../../engine/physics";
import { EggSet } from "./Egg";
import { HUD } from "./HUD";

export const createCharacter = (camera: Camera, hud: HUD, eggSet: EggSet) => {
  const gameObject = new GameObject();

  let lastMovement = Movement.idle;
  let collectedEggs = 0;

  const rigidBox = new RigidCircle(gameObject, 1).setPhysics({
    friction: 0.5,
    inertia: 0.5,
    mass: 10,
    restitution: 0.5,
    disableRotation: true,
  });
  gameObject.add(rigidBox);

  gameObject
    .add(
      SpriteRenderable.build("./find_eggs/textures/character.png", 8, 4, 0)
        .setTransform({ position: Vec2d.from(0, 0) })
        .setAnimator({
          initialPosition: 0,
          lastPosition: 3,
          speed: 10,
          type: AnimationType.ForwardToBegining,
        })
        .runInLoop()
    )
    .withBoundingBox("character", Vec2d.from(1, 1), () => {
      return {
        onCollideStarted: (other, tag) => {
          if (tag === "egg") {
            other.visible = false;
            collectedEggs++;
            hud.updateText(
              collectedEggs === 1
                ? "You found your first egg!"
                : `Found ${collectedEggs} eggs`
            );
          }

          if (eggSet.totalEggs() === collectedEggs) {
            eggSet.repositionEggs();
            collectedEggs = 0;
            hud.updateText(`You won!`);
          }
        },
      };
    })
    .withBehavior(() => {
      // Camera follow user
      if (
        gameObject
          .getTransform()
          .getPosition()
          .sub(camera.getTransform().getPosition())
          .multiply(Vec2d.from(0.5, 1))
          .length() > 4
      ) {
        camera.panTo(gameObject.getTransform().getPosition());
      }
    })
    .withBehavior(() => {
      if (isKeyClicked(Keys.Q)) {
        camera.zoomTowards(gameObject, 0.5);
      }

      if (isKeyClicked(Keys.E)) {
        camera.zoomTowards(gameObject, 2);
      }
    })
    .withBehavior((helper) => {
      const character = helper.component as unknown as SpriteRenderable;

      // walk 2d + sprite animation
      walk2d(rigidBox, 5, (movement) => {
        if (movement === lastMovement) {
          return;
        }

        lastMovement = movement;

        if (movement & Movement.left) {
          character
            .setAnimator({
              initialPosition: 20,
              lastPosition: 23,
              speed: 5,
              type: AnimationType.ForwardToBegining,
            })
            .runInLoop();
        } else if (movement & Movement.right) {
          character
            .setAnimator({
              initialPosition: 24,
              lastPosition: 27,
              speed: 5,
              type: AnimationType.ForwardToBegining,
            })
            .runInLoop();
        } else if (movement & Movement.up) {
          character
            .setAnimator({
              initialPosition: 28,
              lastPosition: 31,
              speed: 5,
              type: AnimationType.ForwardToBegining,
            })
            .runInLoop();
        } else if (movement & Movement.down) {
          character
            .setAnimator({
              initialPosition: 16,
              lastPosition: 19,
              speed: 5,
              type: AnimationType.ForwardToBegining,
            })
            .runInLoop();
        } else {
          character
            .setAnimator({
              initialPosition: 0,
              lastPosition: 3,
              speed: 10,
              type: AnimationType.ForwardToBegining,
            })
            .runInLoop();
        }
      });
    });

  gameObject.add(Light.buildDefault()).withBehavior((helper) => {
    const light = helper.component as unknown as Light;
    light.position = gameObject.getTransform().getPosition().toVec3(0);
  });

  return gameObject;
};
