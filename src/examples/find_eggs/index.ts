import {
  AnimationType,
  BasicScene,
  BoundingBox,
  Camera,
  clampAtBoundary,
  Color,
  FontRenderable,
  GameObject,
  isKeyClicked,
  Keys,
  Movement,
  Renderable,
  setGlobalAmbientColor,
  SpriteRenderable,
  TextureRenderable,
  Vec2d,
  Viewport,
  walk2d,
} from "../../engine";
import { Shake2d } from "../../engine/behaviors";
import { Light } from "../../engine/graphics";
import {
  getMousePosition,
  isButtonPressed,
  isMouseInViewport,
  MouseButton,
} from "../../engine/input";
import { RigidCircle, RigidRectangle } from "../../engine/physics";

const totalEggs = 10;
const eggs: GameObject[] = [];

type HUD = {
  updateText: (message: string) => void;
  gameObject: GameObject;
};

export function findEggs() {
  setGlobalAmbientColor(
    Color.FromColorDef({
      red: 100,
      green: 100,
      blue: 100,
    })
  );

  const mainCamera = new Camera(
    Vec2d.from(0, 0),
    Vec2d.from(16, 8),
    Viewport.Default(Color.Black())
  );

  const mapCamera = new Camera(
    Vec2d.from(0, 0),
    Vec2d.from(51, 25),
    Viewport.build(Vec2d.from(5, 5), Vec2d.from(150, 75), Color.Black(), 1)
  );

  const scene = new BasicScene([mainCamera, mapCamera]);

  const hud = createHUD();
  const characterGameObject = createCharacter(mainCamera, hud);
  scene.add(createScenario(characterGameObject));
  scene.add(characterGameObject);

  for (let i = 0; i < totalEggs; i++) {
    const x = Math.random() * 2 * 19 - 19;
    const y = Math.random() * 2 * 9 - 9;
    const eggGameObject = createEgg(Vec2d.from(x, y));
    eggs.push(eggGameObject);
    scene.add(eggGameObject);
  }

  scene.add(createMouseClick(mainCamera));
  scene.add(hud.gameObject);

  scene.add(createTree());

  return scene;
}

const createHUD = (): HUD => {
  const messageText = FontRenderable.getDefaultFont("Find the eggs!")
    .setColor({ red: 200, green: 200, blue: 200 })
    .setTransform({
      position: Vec2d.from(-7.3, 3.4),
      scale: Vec2d.from(0.3, 0.3),
    })
    .setFrozenCamera(true);
  const gameText = new GameObject();
  gameText.add(messageText);

  return {
    updateText: (message: string) => messageText.setText(message),
    gameObject: gameText,
  };
};

const createScenario = (characterGameObject: GameObject) => {
  const tiles = new GameObject();
  tiles
    .add(
      TextureRenderable.build("./find_eggs/textures/map.png").setTransform({
        scale: Vec2d.from(51, 25),
      })
    )
    .withBoundingBox("scenario", Vec2d.from(0.8, 0.8))
    .withBehavior(() => {
      const tileBoundingBox = tiles.getLastComponent<BoundingBox>(
        BoundingBox.name
      );
      const characterBoundingBox =
        characterGameObject.getLastComponent<BoundingBox>(BoundingBox.name);

      if (tileBoundingBox === undefined || characterBoundingBox === undefined) {
        return;
      }

      clampAtBoundary(tileBoundingBox, characterBoundingBox);
    });
  return tiles;
};

const createCharacter = (camera: Camera, hud: HUD) => {
  const gameObject = new GameObject();

  let lastMovement = Movement.idle;
  let collectedEggs = 0;

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

          if (collectedEggs === totalEggs) {
            eggs.forEach((egg) => {
              egg.visible = true;

              const x = Math.random() * 2 * 19 - 19;
              const y = Math.random() * 2 * 9 - 9;
              egg.setTransform({ position: Vec2d.from(x, y) });

              collectedEggs = 0;
              hud.updateText(`You won!`);
            });
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
    .withBehavior<SpriteRenderable>((character) => {
      // walk 2d + sprite animation
      walk2d(gameObject, 0.08, (movement) => {
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

  gameObject.add(Light.buildDefault()).withBehavior<Light>((light) => {
    light.position = gameObject.getTransform().getPosition().toVec3(0);
  });

  gameObject.add(new RigidCircle(gameObject, 2));

  return gameObject;
};

const createTree = () => {
  const tree = GameObject.build()
    .add(
      TextureRenderable.build("./find_eggs/textures/tree.png").setTransform({
        scale: Vec2d.from(1, 1),
        position: Vec2d.from(0, 0),
      })
    )
    .setTransform({
      position: Vec2d.from(4, 0),
      rotationInDegree: 45,
    }).gameObject;

  tree.add(new RigidRectangle(tree, Vec2d.from(3, 3)));

  return tree;
};

const createEgg = (position: Vec2d) => {
  const egg = new GameObject();
  let oscillateObject: Shake2d;
  egg
    .add(
      TextureRenderable.build("./find_eggs/textures/red_egg.png").setTransform({
        scale: Vec2d.from(0.6, 0.6),
      })
    )
    .withBehavior(() => {
      if (oscillateObject === undefined) {
        oscillateObject = new Shake2d(
          Vec2d.from(0.05, 0.05),
          Vec2d.from(5, 5),
          1200
        );
      } else {
        egg.addToPosition(oscillateObject.getNext());
      }
    })
    .withBoundingBox("egg", Vec2d.from(1.5, 1.5));
  egg.setTransform({
    position: position,
  });

  egg.add(Light.buildDefault()).withBehavior<Light>((light) => {
    light.nearRadius = 0.1;
    light.farRadius = 1;
    light.position = egg.getTransform().getPosition().toVec3(0);
  });

  return egg;
};

const createMouseClick = (mainCamera: Camera) => {
  const click = new GameObject();
  click.visible = false;

  click
    .add(
      Renderable.build().setTransform({
        scale: Vec2d.from(0.2, 0.2),
        position: Vec2d.from(0, 0),
      })
    )
    .withBehavior(() => {
      click.visible = isMouseInViewport(mainCamera);

      if (isButtonPressed(MouseButton.left)) {
        click.setTransform({
          position: getMousePosition(mainCamera),
        });
      }
    });

  click.setTransform({ position: Vec2d.from(100, 100) });

  return click;
};
