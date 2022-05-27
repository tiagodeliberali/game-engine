import { GameObject, TextureRenderable, Vec2d } from "../../engine";
import { Shake2d } from "../../engine/behaviors";
import { Light } from "../../engine/graphics";

export type EggSet = {
  totalEggs: () => number;
  repositionEggs: () => void;
  eggGameObjects: GameObject[];
};

const totalEggs = 10;
const eggs: GameObject[] = [];

const createSingleEgg = (position: Vec2d) => {
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

  egg.add(Light.buildDefault()).withBehavior((helper) => {
    const light = helper.component as unknown as Light;
    light.nearRadius = 0.1;
    light.farRadius = 1;
    light.position = egg.getTransform().getPosition().toVec3(0);
  });

  return egg;
};

export const createEggs = (): EggSet => {
  for (let i = 0; i < totalEggs; i++) {
    const x = Math.random() * 2 * 19 - 19;
    const y = Math.random() * 2 * 9 - 9;
    const eggGameObject = createSingleEgg(Vec2d.from(x, y));
    eggs.push(eggGameObject);
  }

  return {
    eggGameObjects: eggs,
    totalEggs: () => totalEggs,
    repositionEggs: () => {
      eggs.forEach((egg) => {
        egg.visible = true;

        const x = Math.random() * 2 * 19 - 19;
        const y = Math.random() * 2 * 9 - 9;
        egg.setTransform({ position: Vec2d.from(x, y) });
      });
    },
  };
};
