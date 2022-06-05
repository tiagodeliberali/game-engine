import { TileMap } from "./TileMap";
import { Vec2d } from "../DataStructures";

test("build empty tilemap", () => {
  /**
   * [
   *  [15 15]
   *  [15 15]
   *  [15 15]
   * ]
   */
  const tileMap = new TileMap(
    "./find_eggs/textures/tileset.png",
    15,
    28,
    Vec2d.from(0, 0),
    Vec2d.from(2, 3)
  );
  tileMap.build();

  expect(tileMap.tiles.length).toBe(3);
});