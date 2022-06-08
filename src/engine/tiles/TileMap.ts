import { IComponent, SpriteRenderable, Vec2d } from "..";
import { DrawingResources } from "../core";
import { TileMapBoard } from "./TileMapBoard";

export class TileMap implements IComponent {
  spriteSheetPath: string;
  spriteMap: SpriteRenderable;
  board: TileMapBoard;

  constructor(
    spriteSheetPath: string,
    rows: number,
    columns: number,
    position: Vec2d,
    board: TileMapBoard
  ) {
    this.spriteSheetPath = spriteSheetPath;
    this.board = board;

    this.spriteMap = SpriteRenderable.build(
      this.spriteSheetPath,
      rows,
      columns,
      0
    ).setTransform({ position: position });
    this.spriteMap.forceDraw = true;
  }

  isWall(position: Vec2d): boolean {
    const adjustedPosition = position.sub(
      this.spriteMap.getTransform().getPosition()
    );
    const row = Math.floor(adjustedPosition.y);
    const column = Math.floor(adjustedPosition.x);

    if (row >= this.board.rows || column >= this.board.columns) {
      return false;
    }

    const cell = this.board.get(row, column);

    if (adjustedPosition.x - row > 0.5) {
      if (adjustedPosition.y - column > 0.5) return (cell.type & 0b0100) > 0;
      else return (cell.type & 0b0010) > 0;
    } else {
      if (adjustedPosition.y - column > 0.5) return (cell.type & 0b1000) > 0;
      else return (cell.type & 0b0001) > 0;
    }
  }

  load() {
    this.spriteMap.load();
  }

  init() {
    this.spriteMap.init();
  }

  update() {
    this.spriteMap.update();
  }

  draw(resources: DrawingResources) {
    this.drawTiles(resources);
  }

  drawTiles(resources: DrawingResources) {
    let previousTile = -1;
    this.spriteMap.draw(resources);
    const spriteMapPosition = this.spriteMap.getTransform().getPosition();
    let position = Vec2d.from(0, 0);

    for (let row = 0; row < this.board.rows; row++) {
      for (let column = 0; column < this.board.columns; column++) {
        const cell = this.board.get(row, column);

        if (previousTile !== cell.spriteSheetPosition) {
          previousTile = cell.spriteSheetPosition;
          this.spriteMap.setSprite(cell.spriteSheetPosition);
        }

        if (resources.camera.isVisibleOnWC(spriteMapPosition.add(position))) {
          this.spriteMap.fastDraw(position);
        }

        position = position.add(Vec2d.from(1, 0));
      }
      position = Vec2d.from(0, position.y + 1);
    }
  }

  unload() {
    const component = this.spriteMap as IComponent;
    component.unload && component.unload();
  }
}
