import {
  AnimationType,
  Behavior,
  BoundingBox,
  ColisionStatus,
  FontRenderable,
  GameObject,
  isKeyClicked,
  isKeyPressed,
  Keys,
  moveTowardsCurrentDirection,
  Renderable,
  SimplifiedScene,
  SpriteRenderable,
  TextureRenderable,
  Vec2d,
} from "../engine";

const boundingBoxList: BoundingBox[] = [];
const score = [0, 0];

const addBoundingBox = (box: BoundingBox): BoundingBox => {
  boundingBoxList.push(box);
  return box;
};

const buildLimits = () => {
  const limits = new GameObject();

  const upperLimit = Renderable.build().setTransform({
    position: Vec2d.from(50, 45),
    scale: Vec2d.from(90, 1),
  });
  limits.add(upperLimit);
  limits.add(addBoundingBox(BoundingBox.from(upperLimit, "limit")));

  const lowerLimit = Renderable.build().setTransform({
    position: Vec2d.from(50, 5),
    scale: Vec2d.from(90, 1),
  });
  limits.add(lowerLimit);
  limits.add(addBoundingBox(BoundingBox.from(lowerLimit, "limit")));

  const leftLimit = Renderable.build().setTransform({
    position: Vec2d.from(5, 25),
    scale: Vec2d.from(1, 41),
  });
  limits.add(leftLimit);
  limits.add(addBoundingBox(BoundingBox.from(leftLimit, "point1")));

  const rightLimit = Renderable.build().setTransform({
    position: Vec2d.from(95, 25),
    scale: Vec2d.from(1, 41),
  });
  limits.add(rightLimit);
  limits.add(addBoundingBox(BoundingBox.from(rightLimit, "point2")));

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

  const paddle = TextureRenderable.build(texturePath).setTransform({
    position: Vec2d.from(x, 25),
    scale: Vec2d.from(13, 5),
    rotationInDegree: rotation,
  });
  gameObject.add(paddle);
  gameObject.add(
    new Behavior(() => {
      if (isKeyPressed(upKey) && paddle.getTransform().getPosition().y < 39) {
        paddle.addToPosition(Vec2d.from(0, 2));
      } else if (
        isKeyPressed(downKey) &&
        paddle.getTransform().getPosition().y > 11
      ) {
        paddle.addToPosition(Vec2d.from(0, -2));
      }
    })
  );

  gameObject.add(addBoundingBox(new BoundingBox(paddle, "paddle", 1, 8)));

  return gameObject;
};

const createBall = () => {
  const text = new GameObject();
  text.visible = false;

  text.add(
    FontRenderable.getDefaultFont("Ponto!")
      .setColor({ red: 100, green: 200, blue: 100, alpha: 1 })
      .setTransform({
        position: Vec2d.from(40, 25),
        scale: Vec2d.from(5, 5),
      })
  );

  const resultText = FontRenderable.getDefaultFont(
    `score: ${score[0]} - ${score[1]}`
  )
    .setColor({ red: 100, green: 200, blue: 100, alpha: 1 })
    .setTransform({
      position: Vec2d.from(40, 48),
      scale: Vec2d.from(2, 2),
    });
  text.add(resultText);

  const gameObject = new GameObject();
  gameObject.add(text);

  const ball = SpriteRenderable.build(ballPath, 4, 6, 0).setTransform({
    position: Vec2d.from(50, 25),
    scale: Vec2d.from(5, 5),
    rotationInDegree: 30 - Math.random() * 60,
  });

  ball.setAnimator({
    initialPosition: 0,
    lastPosition: 23,
    speed: 3,
    type: AnimationType.ForwardToBegining,
  });
  ball.runInLoop();

  gameObject.add(ball);
  gameObject.add(moveTowardsCurrentDirection(ball, 0.1));

  const computeScore = (player: number) => {
    text.visible = true;
    gameObject.paused = true;
    score[player] += 1;
    resultText.setText(`score: ${score[1]} - ${score[0]}`);
    setTimeout(() => {
      text.visible = false;
      gameObject.paused = false;
      ball.setTransform({
        position: Vec2d.from(50, 25),
        scale: Vec2d.from(5, 5),
        rotationInDegree: 30 - Math.random() * 60,
      });
    }, 2000);
  };

  const box = new BoundingBox(ball, "ball", 2, 2, {
    onCollideStarted: (target, tag, status) => {
      if (tag === "point1") {
        computeScore(0);
      } else if (tag === "point2") {
        computeScore(1);
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
  });

  boundingBoxList.forEach((item) => box.add(item));

  gameObject.add(box);

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

export function pong() {
  const scene = new SimplifiedScene(100, 50);

  const gameComponents = new GameObject();

  gameComponents.add(buildLimits());
  gameComponents.add(createPaddle(icePaddlePath, 15, 270, Keys.W, Keys.S));
  gameComponents.add(createPaddle(slimePaddlePath, 85, 90, Keys.Up, Keys.Down));
  gameComponents.add(createBall());

  scene.add(gameComponents);
  scene.add(pauseBehavior(gameComponents));

  return scene;
}