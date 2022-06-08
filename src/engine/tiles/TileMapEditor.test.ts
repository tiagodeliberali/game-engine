import { TileMapEditor } from ".";
import { Vec2d } from "../DataStructures";
import { TileType } from "./TileType";
import { TileTypeConfiguration } from "./TileTypeConfiguration";
import { BoxTracer } from "./tracer";

test("build empty tilemap", () => {
  // arrange
  const editor = new TileMapEditor(3, 2, new TileTypeConfiguration(15, 0));

  // act
  const map = editor.build();

  // assert
  expect(map.rows).toBe(3);
  expect(map.columns).toBe(2);

  for (let row = 0; row < 3; row++) {
    for (let column = 0; column < 2; column++) {
      // we have all expected cells and all of them are paths
      expect(map.get(row, column).type).toBe(TileType.JustWall);
    }
  }
});

test("draw a box", () => {
  // arrange
  const typeConfig = new TileTypeConfiguration(15, 0);
  const editor = new TileMapEditor(5, 6, typeConfig);
  editor.trace(0, Vec2d.from(1, 1), new BoxTracer(4, 3));

  // act
  const map = editor.build();

  // assert
  /**
   * Expectation is (see the square made of 1's :D):
   * row
   * 4  00  00  00  00  00  00
   *    00  00  00  00  00  00
   *
   * 3  00  11  11  11  11  00
   *    00  10  00  00  01  00
   *
   * 2  00  10  00  00  01  00
   *    00  10  00  00  01  00
   *
   * 1  00  10  00  00  01  00
   *    00  11  11  11  11  00
   *
   * 0  00  00  00  00  00  00
   *    00  00  00  00  00  00
   *
   *     0   1   2   3   4   5 column
   */
  expect(map.get(0, 0).type).toBe(TileType.JustWall);
  expect(map.get(0, 1).type).toBe(TileType.JustWall);
  expect(map.get(0, 2).type).toBe(TileType.JustWall);
  expect(map.get(0, 3).type).toBe(TileType.JustWall);
  expect(map.get(0, 4).type).toBe(TileType.JustWall);
  expect(map.get(0, 5).type).toBe(TileType.JustWall);

  expect(map.get(1, 0).type).toBe(TileType.JustWall);
  expect(map.get(1, 1).type).toBe(TileType.TopRightPath);
  expect(map.get(1, 2).type).toBe(TileType.BottomWall);
  expect(map.get(1, 3).type).toBe(TileType.BottomWall);
  expect(map.get(1, 4).type).toBe(TileType.TopLeftPath);
  expect(map.get(1, 5).type).toBe(TileType.JustWall);

  // just covered part of map, since we already have detailed tests about merge on src/engine/tiles/TileMapBoard.test.ts

  for (let row = 0; row < map.rows; row++) {
    for (let column = 0; column < map.columns; column++) {
      expect(map.get(row, column).spriteSheetPosition).toBe(
        typeConfig.get(map.get(row, column).type)
      );
    }
  }
});

test("draw two boxes on different layers", () => {
  // Arrange
  const defaultTypeConfig = new TileTypeConfiguration(15, 0);
  const layer2TypeConfig = new TileTypeConfiguration(15, 20);

  const editor = new TileMapEditor(5, 6, defaultTypeConfig);
  editor.createLayer(layer2TypeConfig);

  // act
  editor.trace(0, Vec2d.from(0, 0), new BoxTracer(3, 5));
  editor.trace(1, Vec2d.from(1, 1), new BoxTracer(5, 3));

  const board = editor.build();

  // assert
  /**
   * Expectation is (see the connected squares made of 1's):
   * row
   * 4  11  11  11  -1  -1  -1
   *    10  00  01
   *
   * 3  10  11  11  11  11  11
   *    10  10  00  00  00  01
   *
   * 2  10  10  00  00  00  01
   *    10  10  00  00  00  01
   *
   * 1  10  10  00  00  00  01
   *    10  11  11  11  11  11
   *
   * 0  10  00  01  -1  -1  -1
   *    11  11  11
   *
   *     0   1   2   3   4   5 column
   */
  expect(board.get(0, 0).spriteSheetPosition).toBe(
    defaultTypeConfig.get(TileType.TopRightPath)
  );
  expect(board.get(0, 1).spriteSheetPosition).toBe(
    defaultTypeConfig.get(TileType.BottomWall)
  );
  expect(board.get(0, 2).spriteSheetPosition).toBe(
    defaultTypeConfig.get(TileType.TopLeftPath)
  );
  expect(board.get(0, 3).spriteSheetPosition).toBe(
    defaultTypeConfig.get(TileType.JustWall)
  );
  expect(board.get(0, 4).spriteSheetPosition).toBe(
    defaultTypeConfig.get(TileType.JustWall)
  );
  expect(board.get(0, 5).spriteSheetPosition).toBe(
    defaultTypeConfig.get(TileType.JustWall)
  );

  expect(board.get(1, 0).spriteSheetPosition).toBe(
    defaultTypeConfig.get(TileType.LeftWall)
  );
  expect(board.get(1, 1).spriteSheetPosition).toBe(
    layer2TypeConfig.get(TileType.TopRightPath)
  );
  expect(board.get(1, 2).spriteSheetPosition).toBe(
    layer2TypeConfig.get(TileType.BottomWall)
  );
  expect(board.get(1, 3).spriteSheetPosition).toBe(
    layer2TypeConfig.get(TileType.BottomWall)
  );
  expect(board.get(1, 4).spriteSheetPosition).toBe(
    layer2TypeConfig.get(TileType.BottomWall)
  );
  expect(board.get(1, 5).spriteSheetPosition).toBe(
    layer2TypeConfig.get(TileType.TopLeftPath)
  );

  expect(board.get(2, 0).spriteSheetPosition).toBe(
    defaultTypeConfig.get(TileType.LeftWall)
  );
  expect(board.get(2, 1).spriteSheetPosition).toBe(
    layer2TypeConfig.get(TileType.LeftWall)
  );
  expect(board.get(2, 2).spriteSheetPosition).toBe(
    layer2TypeConfig.get(TileType.Path)
  );
  expect(board.get(2, 3).spriteSheetPosition).toBe(
    layer2TypeConfig.get(TileType.Path)
  );
  expect(board.get(2, 4).spriteSheetPosition).toBe(
    layer2TypeConfig.get(TileType.Path)
  );
  expect(board.get(2, 5).spriteSheetPosition).toBe(
    layer2TypeConfig.get(TileType.RightWall)
  );

  expect(board.get(3, 0).spriteSheetPosition).toBe(
    defaultTypeConfig.get(TileType.LeftWall)
  );
  expect(board.get(3, 1).spriteSheetPosition).toBe(
    layer2TypeConfig.get(TileType.BottomRightPath)
  );
  expect(board.get(3, 2).spriteSheetPosition).toBe(
    layer2TypeConfig.get(TileType.TopWall)
  );
  expect(board.get(3, 3).spriteSheetPosition).toBe(
    layer2TypeConfig.get(TileType.TopWall)
  );
  expect(board.get(3, 4).spriteSheetPosition).toBe(
    layer2TypeConfig.get(TileType.TopWall)
  );
  expect(board.get(3, 5).spriteSheetPosition).toBe(
    layer2TypeConfig.get(TileType.BottomLeftPath)
  );

  expect(board.get(4, 0).spriteSheetPosition).toBe(
    defaultTypeConfig.get(TileType.BottomRightPath)
  );
  expect(board.get(4, 1).spriteSheetPosition).toBe(
    defaultTypeConfig.get(TileType.TopWall)
  );
  expect(board.get(4, 2).spriteSheetPosition).toBe(
    defaultTypeConfig.get(TileType.BottomLeftPath)
  );
  expect(board.get(4, 3).spriteSheetPosition).toBe(
    defaultTypeConfig.get(TileType.JustWall)
  );
  expect(board.get(4, 4).spriteSheetPosition).toBe(
    defaultTypeConfig.get(TileType.JustWall)
  );
  expect(board.get(4, 5).spriteSheetPosition).toBe(
    defaultTypeConfig.get(TileType.JustWall)
  );
});
