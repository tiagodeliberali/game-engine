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
    Vec2d.from(0, 0),
    Vec2d.from(15, 8)
  );
  tileMap.defineBox("island", 6 * 28);
  tileMap.addSquare("island", Vec2d.from(0, 0), 10, 3);
  tileMap.addSquare("island", Vec2d.from(3, 2), 3, 3);
  tileMap.addSquare("island", Vec2d.from(3, 4), 10, 3);
  tileMap.addSquare("island", Vec2d.from(9, 0), 3, 8);

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
