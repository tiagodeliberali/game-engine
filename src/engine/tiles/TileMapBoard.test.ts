import { Vec2d } from "../DataStructures";
import { EngineError } from "../EngineError";
import { Cell, TileMapBoard } from "./TileMapBoard";
import { TileType } from "./TileType";
import { BoxTracer } from "./tracer";

test("build empty board", () => {
  // arrange / act
  const board = new TileMapBoard(3, 2);

  // assert
  expect(board.rows).toBe(3);
  expect(board.columns).toBe(2);

  for (let row = 0; row < 3; row++) {
    for (let column = 0; column < 2; column++) {
      // we have all expected cells and all of them are paths
      expect(board.get(row, column).type).toBe(TileType.Empty);
    }
  }
});

test("cannot get cells from outside defined row columns", () => {
  // arrange / act
  const board = new TileMapBoard(3, 2);

  // assert
  expect(() => board.get(5, 5)).toThrowError(EngineError);
});

test("merge a box", () => {
  // arrange
  const board = new TileMapBoard(5, 6);
  const box = new BoxTracer(4, 3).draw();

  // act
  board.merge(Vec2d.from(1, 1), box);

  // assert
  /**
   * Expectation is (see the square made of 1's :D):
   * row
   * 4  -1  -1  -1  -1  -1  -1
   *
   * 3  -1  11  11  11  11  -1
   *        10  00  00  01
   *
   * 2  -1  10  00  00  01  -1
   *        10  00  00  01
   *
   * 1  -1  10  00  00  01  -1
   *        11  11  11  11
   *
   * 0  -1  -1  -1  -1  -1  -1
   *
   *     0   1   2   3   4   5 column
   */
  expect(board.get(0, 0).type).toBe(TileType.Empty);
  expect(board.get(0, 1).type).toBe(TileType.Empty);
  expect(board.get(0, 2).type).toBe(TileType.Empty);
  expect(board.get(0, 3).type).toBe(TileType.Empty);
  expect(board.get(0, 4).type).toBe(TileType.Empty);
  expect(board.get(0, 5).type).toBe(TileType.Empty);

  expect(board.get(1, 0).type).toBe(TileType.Empty);
  expect(board.get(1, 1).type).toBe(TileType.TopRightPath);
  expect(board.get(1, 2).type).toBe(TileType.BottomWall);
  expect(board.get(1, 3).type).toBe(TileType.BottomWall);
  expect(board.get(1, 4).type).toBe(TileType.TopLeftPath);
  expect(board.get(1, 5).type).toBe(TileType.Empty);

  expect(board.get(2, 0).type).toBe(TileType.Empty);
  expect(board.get(2, 1).type).toBe(TileType.LeftWall);
  expect(board.get(2, 2).type).toBe(TileType.Path);
  expect(board.get(2, 3).type).toBe(TileType.Path);
  expect(board.get(2, 4).type).toBe(TileType.RightWall);
  expect(board.get(2, 5).type).toBe(TileType.Empty);

  expect(board.get(3, 0).type).toBe(TileType.Empty);
  expect(board.get(3, 1).type).toBe(TileType.BottomRightPath);
  expect(board.get(3, 2).type).toBe(TileType.TopWall);
  expect(board.get(3, 3).type).toBe(TileType.TopWall);
  expect(board.get(3, 4).type).toBe(TileType.BottomLeftPath);
  expect(board.get(3, 5).type).toBe(TileType.Empty);

  expect(board.get(4, 0).type).toBe(TileType.Empty);
  expect(board.get(4, 1).type).toBe(TileType.Empty);
  expect(board.get(4, 2).type).toBe(TileType.Empty);
  expect(board.get(4, 3).type).toBe(TileType.Empty);
  expect(board.get(4, 4).type).toBe(TileType.Empty);
  expect(board.get(4, 5).type).toBe(TileType.Empty);
});

test("merge two boxes connected on edges", () => {
  // arrange
  const board = new TileMapBoard(5, 6);
  const box1 = new BoxTracer(3, 5).draw();
  const box2 = new BoxTracer(4, 3).draw();

  // act
  board.merge(Vec2d.from(0, 0), box1);
  board.merge(Vec2d.from(2, 1), box2);

  // assert
  /**
   * Expectation is (see the connected squares made of 1's):
   * row
   * 4  11  11  11  -1  -1  -1
   *    10  00  01
   *
   * 3  10  00  01  11  11  11
   *    10  00  00  00  00  01
   *
   * 2  10  00  00  00  00  01
   *    10  00  00  00  00  01
   *
   * 1  10  00  00  00  00  01
   *    10  00  01  11  11  11
   *
   * 0  10  00  01  -1  -1  -1
   *    11  11  11
   *
   *     0   1   2   3   4   5 column
   */
  expect(board.get(0, 0).type).toBe(TileType.TopRightPath);
  expect(board.get(0, 1).type).toBe(TileType.BottomWall);
  expect(board.get(0, 2).type).toBe(TileType.TopLeftPath);
  expect(board.get(0, 3).type).toBe(TileType.Empty);
  expect(board.get(0, 4).type).toBe(TileType.Empty);
  expect(board.get(0, 5).type).toBe(TileType.Empty);

  expect(board.get(1, 0).type).toBe(TileType.LeftWall);
  expect(board.get(1, 1).type).toBe(TileType.Path);
  expect(board.get(1, 2).type).toBe(TileType.BottomRightWall);
  expect(board.get(1, 3).type).toBe(TileType.BottomWall);
  expect(board.get(1, 4).type).toBe(TileType.BottomWall);
  expect(board.get(1, 5).type).toBe(TileType.TopLeftPath);

  expect(board.get(2, 0).type).toBe(TileType.LeftWall);
  expect(board.get(2, 1).type).toBe(TileType.Path);
  expect(board.get(2, 2).type).toBe(TileType.Path);
  expect(board.get(2, 3).type).toBe(TileType.Path);
  expect(board.get(2, 4).type).toBe(TileType.Path);
  expect(board.get(2, 5).type).toBe(TileType.RightWall);

  expect(board.get(3, 0).type).toBe(TileType.LeftWall);
  expect(board.get(3, 1).type).toBe(TileType.Path);
  expect(board.get(3, 2).type).toBe(TileType.TopRightWall);
  expect(board.get(3, 3).type).toBe(TileType.TopWall);
  expect(board.get(3, 4).type).toBe(TileType.TopWall);
  expect(board.get(3, 5).type).toBe(TileType.BottomLeftPath);

  expect(board.get(4, 0).type).toBe(TileType.BottomRightPath);
  expect(board.get(4, 1).type).toBe(TileType.TopWall);
  expect(board.get(4, 2).type).toBe(TileType.BottomLeftPath);
  expect(board.get(4, 3).type).toBe(TileType.Empty);
  expect(board.get(4, 4).type).toBe(TileType.Empty);
  expect(board.get(4, 5).type).toBe(TileType.Empty);
});

test("merge two boxes overlaping on edges", () => {
  // arrange
  const board = new TileMapBoard(5, 6);
  const box1 = new BoxTracer(3, 5).draw();
  const box2 = new BoxTracer(5, 3).draw();

  // act
  board.merge(Vec2d.from(0, 0), box1);
  board.merge(Vec2d.from(1, 1), box2);

  // assert
  /**
   * Expectation is (see the connected squares made of 1's):
   * row
   * 4  11  11  11  -1  -1  -1
   *    10  00  01
   *
   * 3  10  00  01  11  11  11
   *    10  00  00  00  00  01
   *
   * 2  10  00  00  00  00  01
   *    10  00  00  00  00  01
   *
   * 1  10  00  00  00  00  01
   *    10  00  01  11  11  11
   *
   * 0  10  00  01  -1  -1  -1
   *    11  11  11
   *
   *     0   1   2   3   4   5 column
   */
  expect(board.get(0, 0).type).toBe(TileType.TopRightPath);
  expect(board.get(0, 1).type).toBe(TileType.BottomWall);
  expect(board.get(0, 2).type).toBe(TileType.TopLeftPath);
  expect(board.get(0, 3).type).toBe(TileType.Empty);
  expect(board.get(0, 4).type).toBe(TileType.Empty);
  expect(board.get(0, 5).type).toBe(TileType.Empty);

  expect(board.get(1, 0).type).toBe(TileType.LeftWall);
  expect(board.get(1, 1).type).toBe(TileType.Path);
  expect(board.get(1, 2).type).toBe(TileType.BottomRightWall);
  expect(board.get(1, 3).type).toBe(TileType.BottomWall);
  expect(board.get(1, 4).type).toBe(TileType.BottomWall);
  expect(board.get(1, 5).type).toBe(TileType.TopLeftPath);

  expect(board.get(2, 0).type).toBe(TileType.LeftWall);
  expect(board.get(2, 1).type).toBe(TileType.Path);
  expect(board.get(2, 2).type).toBe(TileType.Path);
  expect(board.get(2, 3).type).toBe(TileType.Path);
  expect(board.get(2, 4).type).toBe(TileType.Path);
  expect(board.get(2, 5).type).toBe(TileType.RightWall);

  expect(board.get(3, 0).type).toBe(TileType.LeftWall);
  expect(board.get(3, 1).type).toBe(TileType.Path);
  expect(board.get(3, 2).type).toBe(TileType.TopRightWall);
  expect(board.get(3, 3).type).toBe(TileType.TopWall);
  expect(board.get(3, 4).type).toBe(TileType.TopWall);
  expect(board.get(3, 5).type).toBe(TileType.BottomLeftPath);

  expect(board.get(4, 0).type).toBe(TileType.BottomRightPath);
  expect(board.get(4, 1).type).toBe(TileType.TopWall);
  expect(board.get(4, 2).type).toBe(TileType.BottomLeftPath);
  expect(board.get(4, 3).type).toBe(TileType.Empty);
  expect(board.get(4, 4).type).toBe(TileType.Empty);
  expect(board.get(4, 5).type).toBe(TileType.Empty);
});

test("override two boards", () => {
  // arrange
  const board = new TileMapBoard(5, 6);
  const box1 = new BoxTracer(3, 5).draw();
  const box2 = new BoxTracer(5, 3).draw();

  box1.forEachCell((cell) => (cell.spriteSheetPosition = 1));
  box2.forEachCell((cell) => (cell.spriteSheetPosition = 2));

  // act
  board.overrideBy(Vec2d.from(0, 0), box1);
  board.overrideBy(Vec2d.from(1, 1), box2);

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
  expect(board.get(0, 0)).cellToBe({
    type: TileType.TopRightPath,
    spriteSheetPosition: 1,
  });
  expect(board.get(0, 1)).cellToBe({
    type: TileType.BottomWall,
    spriteSheetPosition: 1,
  });
  expect(board.get(0, 2)).cellToBe({
    type: TileType.TopLeftPath,
    spriteSheetPosition: 1,
  });
  expect(board.get(0, 3)).cellToBe({
    type: TileType.Empty,
    spriteSheetPosition: -1,
  });
  expect(board.get(0, 4)).cellToBe({
    type: TileType.Empty,
    spriteSheetPosition: -1,
  });
  expect(board.get(0, 5)).cellToBe({
    type: TileType.Empty,
    spriteSheetPosition: -1,
  });

  expect(board.get(1, 0)).cellToBe({
    type: TileType.LeftWall,
    spriteSheetPosition: 1,
  });
  expect(board.get(1, 1)).cellToBe({
    type: TileType.TopRightPath,
    spriteSheetPosition: 2,
  });
  expect(board.get(1, 2)).cellToBe({
    type: TileType.BottomWall,
    spriteSheetPosition: 2,
  });
  expect(board.get(1, 3)).cellToBe({
    type: TileType.BottomWall,
    spriteSheetPosition: 2,
  });
  expect(board.get(1, 4)).cellToBe({
    type: TileType.BottomWall,
    spriteSheetPosition: 2,
  });
  expect(board.get(1, 5)).cellToBe({
    type: TileType.TopLeftPath,
    spriteSheetPosition: 2,
  });

  expect(board.get(2, 0)).cellToBe({
    type: TileType.LeftWall,
    spriteSheetPosition: 1,
  });
  expect(board.get(2, 1)).cellToBe({
    type: TileType.LeftWall,
    spriteSheetPosition: 2,
  });
  expect(board.get(2, 2)).cellToBe({
    type: TileType.Path,
    spriteSheetPosition: 2,
  });
  expect(board.get(2, 3)).cellToBe({
    type: TileType.Path,
    spriteSheetPosition: 2,
  });
  expect(board.get(2, 4)).cellToBe({
    type: TileType.Path,
    spriteSheetPosition: 2,
  });
  expect(board.get(2, 5)).cellToBe({
    type: TileType.RightWall,
    spriteSheetPosition: 2,
  });

  expect(board.get(3, 0)).cellToBe({
    type: TileType.LeftWall,
    spriteSheetPosition: 1,
  });
  expect(board.get(3, 1)).cellToBe({
    type: TileType.BottomRightPath,
    spriteSheetPosition: 2,
  });
  expect(board.get(3, 2)).cellToBe({
    type: TileType.TopWall,
    spriteSheetPosition: 2,
  });
  expect(board.get(3, 3)).cellToBe({
    type: TileType.TopWall,
    spriteSheetPosition: 2,
  });
  expect(board.get(3, 4)).cellToBe({
    type: TileType.TopWall,
    spriteSheetPosition: 2,
  });
  expect(board.get(3, 5)).cellToBe({
    type: TileType.BottomLeftPath,
    spriteSheetPosition: 2,
  });

  expect(board.get(4, 0)).cellToBe({
    type: TileType.BottomRightPath,
    spriteSheetPosition: 1,
  });
  expect(board.get(4, 1)).cellToBe({
    type: TileType.TopWall,
    spriteSheetPosition: 1,
  });
  expect(board.get(4, 2)).cellToBe({
    type: TileType.BottomLeftPath,
    spriteSheetPosition: 1,
  });
  expect(board.get(4, 3)).cellToBe({
    type: TileType.Empty,
    spriteSheetPosition: -1,
  });
  expect(board.get(4, 4)).cellToBe({
    type: TileType.Empty,
    spriteSheetPosition: -1,
  });
  expect(board.get(4, 5)).cellToBe({
    type: TileType.Empty,
    spriteSheetPosition: -1,
  });
});

expect.extend({
  cellToBe(received: Cell, expectedCell: Cell) {
    if (received.type !== expectedCell.type)
      return {
        message: () =>
          `expected type to be ${expectedCell.type} but received ${received.type}`,
        pass: false,
      };
    if (received.spriteSheetPosition !== expectedCell.spriteSheetPosition)
      return {
        message: () =>
          `expected spriteSheetPosition to be ${expectedCell.spriteSheetPosition} but received ${received.spriteSheetPosition}`,
        pass: false,
      };

    return {
      message: () => "the cells are equal",
      pass: true,
    };
  },
});
