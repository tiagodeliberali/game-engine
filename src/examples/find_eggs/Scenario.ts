import {
  BoundingBox,
  clampAtBoundary,
  GameObject,
  TileMap,
  Vec2d,
} from "../../engine";

export const createScenario = (characterGameObject: GameObject) => {
  const tiles = new GameObject();
  tiles
    .add(new TileMap("./find_eggs/textures/tileset.png", 15, 28, 28 + 5))
    .withBoundingBox("scenario", Vec2d.from(45, 20))
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
