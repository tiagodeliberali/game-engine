import {
  BasicScene,
  Camera,
  Color,
  GameObject,
  ParticleSet,
  Renderable,
  setGlobalAmbientColor,
  TextureRenderable,
  Vec2d,
  Viewport,
} from "../../engine";
import {
  getMousePosition,
  isButtonPressed,
  isMouseInViewport,
  MouseButton,
} from "../../engine/input";
import { PhysicsEngine, RigidRectangle } from "../../engine/physics";
import { createHUD } from "./HUD";
import { createCharacter } from "./Character";
import { createScenario } from "./Scenario";
import { createEggs } from "./Egg";

export function findEggs() {
  setGlobalAmbientColor(
    Color.FromColorDef({
      red: 100,
      green: 100,
      blue: 100,
    })
  );

  PhysicsEngine.setPhysics({
    globalAcceleration: Vec2d.from(0, 0),
    globalFriction: 0.1,
    globalAngularFriction: 0.1,
  });

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
  mapCamera.tag = 1;

  const scene = new BasicScene([mainCamera, mapCamera]);
  scene.displayOnCamera(1);

  const hud = createHUD();
  const eggSet = createEggs();
  const characterGameObject = createCharacter(mainCamera, hud, eggSet);

  scene.add(createScenario(characterGameObject));
  scene.add(characterGameObject);
  eggSet.eggGameObjects.forEach((x) => scene.add(x));

  scene.add(createMouseClick(mainCamera));
  scene.add(hud.gameObject);

  scene.add(createTree());

  scene.add(new ParticleSet(Vec2d.from(0, 0), 30, 10, 25));

  return scene;
}

// random things
// =============

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

  tree.add(
    new RigidRectangle(tree, Vec2d.from(4, 4)).setPhysics({
      friction: 0.5,
      inertia: 0.5,
      mass: 10,
      restitution: 0.5,
    })
  );

  return tree;
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
