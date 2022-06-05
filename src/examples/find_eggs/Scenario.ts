import { GameObject, TileMap, Vec2d } from "../../engine";
import { clampAtTileMap } from "../../engine/behaviors/Walking";
import { RigidRectangle } from "../../engine/physics";

export const createScenario = (characterGameObject: GameObject) => {
  const tiles = new GameObject();

  const tileMap = new TileMap(
    "./find_eggs/textures/tileset.png",
    15,
    28,
    Vec2d.from(-1, -1),
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
      const characterRigidShape =
        characterGameObject.getLastComponent<RigidRectangle>(
          RigidRectangle.name
        );

      if (characterRigidShape === undefined) {
        return;
      }

      clampAtTileMap(characterRigidShape, tileMap);
    });
  return tiles;
};
