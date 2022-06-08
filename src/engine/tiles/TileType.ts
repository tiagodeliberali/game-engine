/**
 * Represents the information regarding a block on the tile map. You can visualize each block as 4 regions that can be filled by wall or by path.
 * Here is an example of a LeftWall tile:
 *
 * top left     --- ---  top right
 *             | 1 | 0 |
 *              --- ---
 *             | 1 | 0 |
 * bottom left  --- ---  bottom right
 *
 * The wall is represented by 1 and the path by 0. In this way, you just have 16 possibilities, as described bellow.
 * For example, considering the example above, of a left wall, we will find the type 0b1010. We can explode this strucuture as:
 *  - 0b: binary number indicator
 *  - 1: top left
 *  - 0: top right
 *  - 1: bottom left
 *  - 0: bottom right
 *
 * All possibilities bellow needs to be mapped to a position in the sprite sheet, so we can draw the tile map.
 */
export enum TileType {
  Empty = -1,
  Path = 0b000,

  // one wall
  TopLeftWall = 0b1000,
  TopRightWall = 0b0100,
  BottomLeftWall = 0b0010,
  BottomRightWall = 0b0001,

  // two walls
  TopWall = 0b1100,
  BottomWall = 0b0011,
  LeftWall = 0b1010,
  RightWall = 0b0101,
  TopLeftBottomRightWall = 0b1001,
  TopRightBottomLeftWall = 0b0110,

  // three walls
  TopLeftPath = 0b0111,
  TopRightPath = 0b1011,
  BottomLeftPath = 0b1101,
  BottomRightPath = 0b1110,

  // four walls
  JustWall = 0b1111,
}
