import { EngineError } from "../EngineError";
import { TileType } from "./TileType";

/**
 * TileBox is reponsible for mapping all TileTypes to positions in a sprite sheet. For now, it follows a really specific sequency of positions, based on the
 * sprite sheet I've been using. There is more work to be done to allow some easy to configure way to calculate positions.
 */
export class TileTypeConfiguration {
  tileValues: Map<TileType, number> = new Map();
  otherWalls: number[];

  constructor(columns: number, topLeftCorner: number) {
    // left side
    this.tileValues.set(TileType.BottomRightPath, topLeftCorner);
    this.tileValues.set(TileType.LeftWall, topLeftCorner + columns);
    this.tileValues.set(
      TileType.TopRightPath,
      this.get(TileType.LeftWall) + columns
    );

    // middle
    this.tileValues.set(TileType.TopWall, topLeftCorner + 1);
    this.tileValues.set(TileType.Path, this.get(TileType.LeftWall) + 1);
    this.tileValues.set(
      TileType.BottomWall,
      this.get(TileType.TopRightPath) + 1
    );

    // right side
    this.tileValues.set(TileType.BottomLeftPath, topLeftCorner + 2);
    this.tileValues.set(TileType.RightWall, this.get(TileType.Path) + 1);
    this.tileValues.set(
      TileType.TopLeftPath,
      this.get(TileType.BottomWall) + 1
    );

    // corners
    this.tileValues.set(
      TileType.BottomRightWall,
      this.get(TileType.BottomLeftPath) + 1
    );
    this.tileValues.set(
      TileType.BottomLeftWall,
      this.get(TileType.BottomLeftPath) + 2
    );
    this.tileValues.set(
      TileType.TopRightWall,
      this.get(TileType.RightWall) + 1
    );
    this.tileValues.set(TileType.TopLeftWall, this.get(TileType.RightWall) + 2);

    // double corners
    this.tileValues.set(
      TileType.TopRightBottomLeftWall,
      this.get(TileType.TopLeftPath) + 1
    );
    this.tileValues.set(
      TileType.TopLeftBottomRightWall,
      this.get(TileType.TopLeftPath) + 2
    );

    // walls
    this.tileValues.set(
      TileType.JustWall,
      this.get(TileType.BottomLeftWall) + 1
    );

    this.otherWalls = [
      this.get(TileType.JustWall) + 1,
      this.get(TileType.JustWall) + columns,
      this.get(TileType.JustWall) + columns + 1,
    ];
  }

  get(type: TileType): number {
    const value = this.tileValues.get(type);

    if (value === undefined) {
      throw new EngineError(
        TileTypeConfiguration.name,
        `Could not find value for ${type}`
      );
    }

    return value;
  }
}
