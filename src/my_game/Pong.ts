import {
  AnimationType,
  Behavior,
  ColisionStatus,
  FontRenderable,
  GameObject,
  isKeyClicked,
  isKeyPressed,
  ITransformable,
  Keys,
  moveTowardsCurrentDirection,
  Renderable,
  SimplifiedScene,
  SpriteRenderable,
  TextureRenderable,
  Vec2d,
} from "../engine";

type HUD = {
  updateMessage: (message: string) => void;
  hideMessage: () => void;
  updateScore: (player: number) => void;
  resetScore: () => void;
};

export function pong() {
  const scene = new SimplifiedScene(100, 50);

  const gameComponents = new GameObject();

  const hud = createHUD(scene);

  gameComponents.add(buildLimits());
  gameComponents.add(createPaddle(icePaddlePath, 15, 270, Keys.W, Keys.S));
  gameComponents.add(createPaddle(slimePaddlePath, 85, 90, Keys.Up, Keys.Down));
  gameComponents.add(createBall(hud));

  scene.add(gameComponents);
  scene.add(pauseBehavior(gameComponents));

  return scene;
}

const buildLimits = () => {
  const limits = new GameObject();

  limits
    .add(
      Renderable.build().setTransform({
        position: Vec2d.from(50, 45),
        scale: Vec2d.from(90, 1),
      })
    )
    .withBoundingBox("limit");

  limits
    .add(
      Renderable.build().setTransform({
        position: Vec2d.from(50, 5),
        scale: Vec2d.from(90, 1),
      })
    )
    .withBoundingBox("limit");

  limits
    .add(
      Renderable.build().setTransform({
        position: Vec2d.from(5, 25),
        scale: Vec2d.from(1, 41),
      })
    )
    .withBoundingBox("point1");

  limits
    .add(
      Renderable.build().setTransform({
        position: Vec2d.from(95, 25),
        scale: Vec2d.from(1, 41),
      })
    )
    .withBoundingBox("point2");

  return limits;
};

// https://craftpix.net/freebies/free-buttons-2d-game-objects/
const icePaddlePath = "./textures/ice_paddle.png";
const slimePaddlePath = "./textures/slime_paddle.png";

// https://www.spriters-resource.com/pc_computer/bioniclethelegendofmatanuiprototype/sheet/108251/
const ballPath = "./textures/ball.png";

const createPaddle = (
  texturePath: string,
  x: number,
  rotation: number,
  upKey: Keys,
  downKey: Keys
) => {
  const gameObject = new GameObject();

  gameObject
    .add(
      TextureRenderable.build(texturePath).setTransform({
        position: Vec2d.from(x, 25),
        scale: Vec2d.from(13, 5),
        rotationInDegree: rotation,
      })
    )
    .withBoundingBox("paddle", Vec2d.from(0.2, 2.2))
    .withBehavior((component) => {
      const paddle = component as unknown as ITransformable;

      if (isKeyPressed(upKey) && paddle.getTransform().getPosition().y < 39) {
        paddle.addToPosition(Vec2d.from(0, 2));
      } else if (
        isKeyPressed(downKey) &&
        paddle.getTransform().getPosition().y > 11
      ) {
        paddle.addToPosition(Vec2d.from(0, -2));
      }
    });

  return gameObject;
};

const actionMessageText = "Ponto!";
const score = [0, 0];

const createHUD = (scene: SimplifiedScene) => {
  const messageText = FontRenderable.getDefaultFont("")
    .setColor({ red: 100, green: 200, blue: 100, alpha: 1 })
    .setTransform({
      position: Vec2d.from(40, 25),
      scale: Vec2d.from(5, 5),
    });

  const scoreText = FontRenderable.getDefaultFont("0 - 0")
    .setColor({ red: 100, green: 200, blue: 100, alpha: 1 })
    .setTransform({
      position: Vec2d.from(48, 48),
      scale: Vec2d.from(2, 2),
    });

  scene.add(messageText);
  scene.add(scoreText);

  return {
    updateMessage: (message: string) => messageText.setText(message),
    hideMessage: () => messageText.setText(""),
    updateScore: (player: number) => {
      score[player] += 1;
      scoreText.setText(`${score[0]} - ${score[1]}`);
    },
    resetScore: () => {
      score[0] = 0;
      score[1] = 0;
      scoreText.setText(`${score[0]} - ${score[1]}`);
    },
  };
};

const createBall = (hud: HUD) => {
  const gameObject = new GameObject();

  const getRandomAngle = () => {
    let angle = 30 - Math.random() * 60;

    if (Math.random() > 0.5) {
      angle = 180 + angle;
    }

    return angle;
  };

  gameObject
    .add(
      SpriteRenderable.build(ballPath, 4, 6, 0)
        .setTransform({
          position: Vec2d.from(50, 25),
          scale: Vec2d.from(5, 5),
          rotationInDegree: getRandomAngle(),
        })
        .setAnimator({
          initialPosition: 0,
          lastPosition: 23,
          speed: 3,
          type: AnimationType.ForwardToBegining,
        })
        .runInLoop()
    )
    .withBehavior((component) => {
      const ball = component as unknown as ITransformable;
      moveTowardsCurrentDirection(ball, 0.1);
    })
    .withBoundingBox("ball", Vec2d.from(0.5, 0.5), (component) => {
      const ball = component as unknown as ITransformable;

      const startAgain = () => {
        hud.hideMessage();
        gameObject.paused = false;
        ball.setTransform({
          position: Vec2d.from(50, 25),
          rotationInDegree: getRandomAngle(),
        });
      };

      const finishGame = (winner: number) => {
        hud.updateMessage(`#${winner + 1} won!`);
        setTimeout(() => {
          hud.resetScore();
          startAgain();
        }, 5000);
      };

      const computeScore = (player: number) => {
        gameObject.paused = true;
        hud.updateScore(player);
        hud.updateMessage(actionMessageText);
        setTimeout(() => {
          if (score[0] > 2) {
            finishGame(0);
          } else if (score[1] > 2) {
            finishGame(1);
          } else {
            startAgain();
          }
        }, 2000);
      };

      return {
        onCollideStarted: (target, tag, status) => {
          if (tag === "point1") {
            computeScore(1);
          } else if (tag === "point2") {
            computeScore(0);
          } else if (
            !(status & ColisionStatus.collideLeft) ||
            !(status & ColisionStatus.collideRight)
          ) {
            ball.setTransform({
              rotationInDegree: 180 - ball.getTransform().getRotationInDegree(),
            });
          } else if (
            !(status & ColisionStatus.collideTop) ||
            !(status & ColisionStatus.collideBottom)
          ) {
            ball.setTransform({
              rotationInDegree: -ball.getTransform().getRotationInDegree(),
            });
          }
        },
      };
    });

  // gameObject.add(
  //   new Behavior(() => {
  //     scene.camera.clampAtBoundary(box, Vec2d.from(0.7, 0.7));
  //   })
  // );

  return gameObject;
};

const pauseBehavior = (gameComponents: GameObject) => {
  const pauseObject = new GameObject();
  pauseObject.visible = false;
  pauseObject.add(
    FontRenderable.getDefaultFont("Paused")
      .setColor({ red: 100, green: 200, blue: 100, alpha: 1 })
      .setTransform({
        position: Vec2d.from(40, 25),
        scale: Vec2d.from(5, 5),
      })
  );

  pauseObject.add(
    new Behavior(() => {
      if (isKeyClicked(Keys.Space)) {
        gameComponents.paused = !gameComponents.paused;
        pauseObject.visible = gameComponents.paused;
      }
    })
  );

  return pauseObject;
};
