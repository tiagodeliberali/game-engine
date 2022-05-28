import {
  BoundingBox,
  clampAtBoundary,
  GameObject,
  TileMap,
  Vec2d,
} from "../../engine";

export const createScenario = (characterGameObject: GameObject) => {
  const tiles = new GameObject();

  const tileMap = new TileMap(
    "./find_eggs/textures/tileset.png",
    15,
    28,
    Vec2d.from(-1, -2)
  );
  tileMap.defineBox("island", 6 * 28);
  tileMap.addBox("island", 0, Vec2d.from(-22, 12), 47, 22);

  tiles
    .add(tileMap)
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
