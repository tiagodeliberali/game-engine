import { GameObject, TileMap, Vec2d } from "../../engine";
import { clampAtTileMap } from "../../engine/behaviors/Walking";
import { RigidRectangle } from "../../engine/physics";
import { TileMapEditor, TileTypeConfiguration } from "../../engine/tiles";
import { BoxTracer } from "../../engine/tiles/tracer";

export const createScenario = (characterGameObject: GameObject) => {
  const tiles = new GameObject();

  const editor = new TileMapEditor(
    20,
    20,
    new TileTypeConfiguration(28, 6 * 28)
  );

  editor.trace(0, Vec2d.from(0, 0), new BoxTracer(3, 10));
  editor.trace(0, Vec2d.from(3, 2), new BoxTracer(3, 3));
  editor.trace(0, Vec2d.from(3, 4), new BoxTracer(10, 3));
  editor.trace(0, Vec2d.from(9, 0), new BoxTracer(3, 8));

  const tileMap = new TileMap(
    "./find_eggs/textures/tileset.png",
    15,
    28,
    Vec2d.from(-1, -1),
    editor.build()
  );

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
