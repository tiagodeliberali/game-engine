import { TileType } from "..";
import { TileMapBoard } from "../TileMapBoard";
import { ITileTracer } from "./ITileTracer";

export class BoxTracer implements ITileTracer {
  private width: number;
  private height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  draw(): TileMapBoard {
    const box = new TileMapBoard(this.height, this.width);

    for (let row = 0; row < this.height; row++) {
      for (let column = 0; column < this.width; column++) {
        if (column === 0) {
          if (row === 0) box.setTileType(row, column, TileType.TopRightPath);
          else if (row === this.height - 1)
            box.setTileType(row, column, TileType.BottomRightPath);
          else box.setTileType(row, column, TileType.LeftWall);
        } else if (column === this.width - 1) {
          if (row === 0) box.setTileType(row, column, TileType.TopLeftPath);
          else if (row === this.height - 1)
            box.setTileType(row, column, TileType.BottomLeftPath);
          else box.setTileType(row, column, TileType.RightWall);
        } else {
          if (row === 0) box.setTileType(row, column, TileType.BottomWall);
          else if (row === this.height - 1)
            box.setTileType(row, column, TileType.TopWall);
          else box.setTileType(row, column, TileType.Path);
        }
      }
    }

    return box;
  }
}
