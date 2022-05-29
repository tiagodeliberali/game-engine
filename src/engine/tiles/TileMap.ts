import { EngineError, IComponent, SpriteRenderable, Vec2d } from "..";
import { DrawingResources } from "../core";
import { TileBox } from "./TileBox";
import { TileType } from "./Tile";

type TileSet = {
  position: Vec2d;
  tiles: TileType[][];
};

export class TileMap implements IComponent {
  spriteSheetPath: string;
  spriteMap: SpriteRenderable;
  boxes: Map<string, TileBox> = new Map();
  tileBlocksByBox: Map<string, TileSet[]> = new Map();
  tiles: number[][] = [];
  columns: number;
  size: Vec2d;

  constructor(
    spriteSheetPath: string,
    rows: number,
    columns: number,
    position: Vec2d,
    size: Vec2d
  ) {
    this.spriteSheetPath = spriteSheetPath;
    this.columns = columns;
    this.size = size;

    this.spriteMap = SpriteRenderable.build(
      this.spriteSheetPath,
      rows,
      columns,
      0
    ).setTransform({ position: position });
    this.spriteMap.forceDraw = true;
  }

  draw(resources: DrawingResources) {
    this.drawTiles(resources);
  }

  build() {
    const tiles: TileType[][] = [];

    for (let row = 0; row < this.size.y; row++) {
      tiles.push([]);
      for (let column = 0; column < this.size.x; column++) {
        tiles[row].push(TileType.JustWall);
      }
    }

    this.tileBlocksByBox.forEach((set, tileBoxName) => {
      const tileBox = this.boxes.get(tileBoxName);

      if (tileBox === undefined) {
        throw new EngineError(
          TileMap.name,
          `Could not find ${tileBoxName} as a defined box`
        );
      }

      set.forEach((tileSet) => {
        let position = Vec2d.from(
          tileSet.position.x,
          tileSet.position.y + tileSet.tiles.length - 1
        );

        tileSet.tiles.forEach((row) => {
          row.forEach((cell) => {
            tiles[position.y][position.x] &= cell;
            position = position.add(Vec2d.from(1, 0));
          });
          position = Vec2d.from(tileSet.position.x, position.y - 1);
        });
      });

      tiles.forEach((row) => {
        const tileRow: number[] = [];
        row.forEach((cell) => {
          tileRow.push(tileBox.get(cell));
        });
        this.tiles.push(tileRow);
      });
    });
  }

  drawTiles(resources: DrawingResources) {
    let previousTile = -1;
    this.spriteMap.draw(resources);
    const spriteMapPosition = this.spriteMap.getTransform().getPosition();
    let position = Vec2d.from(0, 0);

    this.tiles.forEach((row) => {
      // setup variables during first draw
      row.forEach((cell) => {
        if (previousTile !== cell) {
          previousTile = cell;
          this.spriteMap.setSprite(cell);
        }

        if (resources.camera.isVisibleOnWC(spriteMapPosition.add(position))) {
          this.spriteMap.fastDraw(position);
        }

        position = position.add(Vec2d.from(1, 0));
      });
      position = Vec2d.from(0, position.y + 1);
    });
  }

  addSquare(name: string, position: Vec2d, width: number, height: number) {
    const box = this.boxes.get(name);

    if (box === undefined) {
      throw new EngineError(TileMap.name, `Box name not found: ${name}`);
    }

    if (this.tileBlocksByBox.get(name) === undefined) {
      this.tileBlocksByBox.set(name, []);
    }

    this.tileBlocksByBox
      .get(name)
      ?.push({ position, tiles: this.createSquare(width, height) });
  }

  createSquare(width: number, height: number): TileType[][] {
    const box: TileType[][] = [];

    for (let row = 0; row < height; row++) {
      box[row] = [];
      for (let column = 0; column < width; column++) {
        if (column === 0) {
          if (row === 0) box[row][column] = TileType.BottomRightPath;
          else if (row === height - 1) box[row][column] = TileType.TopRightPath;
          else box[row][column] = TileType.LeftWall;
        } else if (column === width - 1) {
          if (row === 0) box[row][column] = TileType.BottomLeftPath;
          else if (row === height - 1) box[row][column] = TileType.TopLeftPath;
          else box[row][column] = TileType.RightWall;
        } else {
          if (row === 0) box[row][column] = TileType.TopWall;
          else if (row === height - 1) box[row][column] = TileType.BottomWall;
          else box[row][column] = TileType.Path;
        }
      }
    }

    return box;
  }

  defineBox(name: string, topLeftCorner: number) {
    this.boxes.set(name, new TileBox(this.columns, topLeftCorner));
  }

  load() {
    this.spriteMap.load();
  }

  init() {
    this.spriteMap.init();
    this.build();
  }

  update() {
    this.spriteMap.update();
  }

  unload() {
    const component = this.spriteMap as IComponent;
    component.unload && component.unload();
  }
}
