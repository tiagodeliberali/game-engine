import {
  BoundingBox,
  clampAtBoundary,
  GameObject,
  TextureRenderable,
  Vec2d,
} from "../../engine";

export const createScenario = (characterGameObject: GameObject) => {
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
