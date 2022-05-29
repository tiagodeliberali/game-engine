export enum TileType {
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
