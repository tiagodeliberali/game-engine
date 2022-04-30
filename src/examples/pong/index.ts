import {
  AnimationType,
  Behavior,
  ColisionStatus,
  FontRenderable,
  GameObject,
  IRenderable,
  isKeyClicked,
  isKeyPressed,
  Keys,
  moveTowardsCurrentDirection,
  Renderable,
  SimplifiedScene,
  SpriteRenderable,
  TextureRenderable,
  Vec2d,
  ResourceComponent,
  Audio,
} from "../../engine";

type HUD = {
  togglePause: () => void;
  updateMessage: (message: string) => void;
  hideMessage: () => void;
  updateScore: (player: number) => void;
  resetScore: () => void;
};

export function pong() {
  const scene = new SimplifiedScene(100, 50);

  const gameComponents = new GameObject();

  const { hud, hudGameObject } = createHUD();
  scene.add(hudGameObject);

  gameComponents.add(buildLimits());
  gameComponents.add(createPaddle(icePaddlePath, 15, 270, Keys.W, Keys.S));
  gameComponents.add(createPaddle(slimePaddlePath, 85, 90, Keys.Up, Keys.Down));
  gameComponents.add(createBall(hud));

  scene.add(gameComponents);
  scene.add(pauseBehavior(gameComponents, hud));

  return scene;
}

const buildLimits = () => {
  const top = GameObject.build()
    .add(Renderable.build())
    .withBoundingBox("limit")
    .setTransform({
      position: Vec2d.from(50, 45),
      scale: Vec2d.from(90, 1),
    });

  const bottom = GameObject.build()
    .add(Renderable.build())
    .withBoundingBox("limit")
    .setTransform({
      position: Vec2d.from(50, 5),
      scale: Vec2d.from(90, 1),
    });

  const left = GameObject.build()
    .add(Renderable.build())
    .withBoundingBox("point1")
    .setTransform({
      position: Vec2d.from(5, 25),
      scale: Vec2d.from(1, 41),
    });

  const right = GameObject.build()
    .add(Renderable.build())
    .withBoundingBox("point2")
    .setTransform({
      position: Vec2d.from(95, 25),
      scale: Vec2d.from(1, 41),
    });

  const limits = new GameObject();
  limits.add(top.gameObject);
  limits.add(bottom.gameObject);
  limits.add(left.gameObject);
  limits.add(right.gameObject);
  return limits;
};

// https://craftpix.net/freebies/free-buttons-2d-game-objects/
const icePaddlePath = "./textures/ice_paddle.png";
const slimePaddlePath = "./textures/slime_paddle.png";

// https://www.spriters-resource.com/pc_computer/bioniclethelegendofmatanuiprototype/sheet/108251/
const ballPath = "./textures/ball.png";

// https://freesound.org/people/AdamJ/sounds/417209/
const pongCuePath = "./sounds/pong.wav";

// https://freesound.org/people/AdamJ/sounds/417210/
const endCuePath = "./sounds/end.wav";

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
        scale: Vec2d.from(13, 5),
        rotationInDegree: rotation,
      })
    )
    .withBoundingBox("paddle", Vec2d.from(0.2, 2.2))
    .withBehavior<IRenderable>(() => {
      if (
        isKeyPressed(upKey) &&
        gameObject.getTransform().getPosition().y < 39
      ) {
        gameObject.addToPosition(Vec2d.from(0, 2));
      } else if (
        isKeyPressed(downKey) &&
        gameObject.getTransform().getPosition().y > 11
      ) {
        gameObject.addToPosition(Vec2d.from(0, -2));
      }
    })
    .setTransform({ position: Vec2d.from(x, 25) });

  return gameObject;
};

const pausedText = "Paused";
const actionMessageText = "Ponto!";
const score = [0, 0];
let paused = false;

const createHUD = () => {
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

  const hudGameObject = new GameObject();

  hudGameObject.add(messageText);
  hudGameObject.add(scoreText);

  const hud = {
    updateMessage: (message: string) => !paused && messageText.setText(message),
    hideMessage: () => !paused && messageText.setText(""),
    updateScore: (player: number) => {
      score[player] += 1;
      scoreText.setText(`${score[0]} - ${score[1]}`);
    },
    resetScore: () => {
      score[0] = 0;
      score[1] = 0;
      scoreText.setText(`${score[0]} - ${score[1]}`);
    },
    togglePause: () => {
      paused = !paused;

      if (paused) {
        messageText.setText(pausedText);
      } else {
        messageText.setText("");
      }
    },
  };

  return { hud, hudGameObject };
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
      rotationInDegree: getRandomAngle(),
      position: Vec2d.from(50, 25),
    })
    .withBehavior<IRenderable>(() => {
      moveTowardsCurrentDirection(gameObject, 0.5);
    })
    .withBoundingBox<IRenderable>("ball", Vec2d.from(0.5, 0.5), () => {
      const startAgain = () => {
        hud.hideMessage();
        gameObject.paused = false;
        gameObject.setTransform({
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
        endCue.get<Audio>().playOnce(0.5);
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
            gameObject.setTransform({
              rotationInDegree:
                180 - gameObject.getTransform().getRotationInDegree(),
            });
            pongCue.get<Audio>().playOnce();
          } else if (
            !(status & ColisionStatus.collideTop) ||
            !(status & ColisionStatus.collideBottom)
          ) {
            gameObject.setTransform({
              rotationInDegree: -gameObject
                .getTransform()
                .getRotationInDegree(),
            });
            pongCue.get<Audio>().playOnce();
          }
        },
      };
    });

  return gameObject;
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
