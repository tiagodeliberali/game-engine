import {
  AnimationType,
  Audio,
  GameObject,
  ResourceComponent,
  SpriteRenderable,
  Vec2d,
} from "../../engine";
import { HUD } from "./HUD";

// https://www.spriters-resource.com/pc_computer/bioniclethelegendofmatanuiprototype/sheet/108251/
const ballPath = "./textures/ball.png";

// https://freesound.org/people/AdamJ/sounds/417209/
const pongCuePath = "./sounds/pong.wav";

// https://freesound.org/people/AdamJ/sounds/417210/
const endCuePath = "./sounds/end.wav";

const actionMessageText = "Ponto!";

export const createBall = (hud: HUD) => {
  const gameObject = new GameObject();

  const getRandomAngleVelocity = () => {
    let angle = 30 - Math.random() * 60;

    if (Math.random() > 0.5) {
      angle = 180 + angle;
    }

    const velocity = Vec2d.from(1, 0).rotateInDegree(angle).scale(30);

    return velocity;
  };

  const pongCue = new ResourceComponent(pongCuePath);
  gameObject.add(pongCue);

  const endCue = new ResourceComponent(endCuePath);
  gameObject.add(endCue);

  gameObject
    .add(
      SpriteRenderable.build(ballPath, 4, 6, 0)
        .setTransform({
          scale: Vec2d.from(5, 5),
        })
        .setAnimator({
          initialPosition: 0,
          lastPosition: 23,
          speed: 3,
          type: AnimationType.ForwardToBegining,
        })
        .runInLoop()
    )
    .setTransform({
      position: Vec2d.from(50, 25),
    })
    .withRigidCircle(1, { velocity: getRandomAngleVelocity() })
    .withBoundingBox("ball", Vec2d.from(0.5, 0.5), (helper) => {
      const startAgain = () => {
        hud.hideMessage();
        gameObject.paused = false;
        gameObject.setTransform({
          position: Vec2d.from(50, 25),
        });
        helper.lastRigidShape?.setVelocity(getRandomAngleVelocity());
      };

      const finishGame = (winner: number) => {
        hud.updateMessage(`#${winner + 1} won!`);
        setTimeout(() => {
          hud.resetScore();
          startAgain();
        }, 5000);
      };

      const computeScore = (player: number) => {
        endCue.get<Audio>().playOnce(0.5);
        gameObject.paused = true;
        hud.updateScore(player);
        hud.updateMessage(actionMessageText);
        setTimeout(() => {
          if (hud.getScore(0) > 2) {
            finishGame(0);
          } else if (hud.getScore(1) > 2) {
            finishGame(1);
          } else {
            startAgain();
          }
        }, 2000);
      };

      return {
        onCollideStarted: (_, tag) => {
          if (tag === "point1") {
            computeScore(1);
          } else if (tag === "point2") {
            computeScore(0);
          }
        },
      };
    });

  return gameObject;
};
