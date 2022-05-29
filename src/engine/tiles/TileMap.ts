import { EngineError, IComponent, SpriteRenderable, Vec2d } from "..";
import { DrawingResources } from "../core";

class TileBox {
  topLeftCorner: number;
  leftSide: number;
  bottomLeftCorner: number;
  top: number;
  topRightCorner: number;
  rightSide: number;
  bottomRightCorner: number;
  bottom: number;
  fill: number;

  constructor(columns: number, topLeftCorner: number) {
    this.topLeftCorner = topLeftCorner;
    this.leftSide = this.topLeftCorner + columns;
    this.bottomLeftCorner = this.leftSide + columns;
    this.top = this.topLeftCorner + 1;
    this.fill = this.leftSide + 1;

    this.topRightCorner = this.topLeftCorner + 2;
    this.rightSide = this.leftSide + 2;
    this.bottomRightCorner = this.bottomLeftCorner + 2;
    this.bottom = this.bottomLeftCorner + 1;
  }

  create(width: number, height: number): number[][] {
    const box: number[][] = [];

    for (let row = 0; row < height; row++) {
      box[row] = [];
      for (let column = 0; column < width; column++) {
        if (column === 0) {
          if (row === 0) box[row][column] = this.topLeftCorner;
          else if (row === height - 1) box[row][column] = this.bottomLeftCorner;
          else box[row][column] = this.leftSide;
        } else if (column === width - 1) {
          if (row === 0) box[row][column] = this.topRightCorner;
          else if (row === height - 1)
            box[row][column] = this.bottomRightCorner;
          else box[row][column] = this.rightSide;
        } else {
          if (row === 0) box[row][column] = this.top;
          else if (row === height - 1) box[row][column] = this.bottom;
          else box[row][column] = this.fill;
        }
      }
    }

    return box;
  }
}

type TileSet = {
  position: Vec2d;
  tiles: number[][];
};

export class TileMap implements IComponent {
  spriteSheetPath: string;
  spriteMap: SpriteRenderable;
  position: Vec2d;
  boxes: Map<string, TileBox> = new Map();
  tiles: Map<number, TileSet[]> = new Map(); // <layer, tiles to draw>
  columns: number;

  constructor(
    spriteSheetPath: string,
    rows: number,
    columns: number,
    position: Vec2d
  ) {
    this.spriteSheetPath = spriteSheetPath;
    this.columns = columns;

    this.spriteMap = SpriteRenderable.build(
      this.spriteSheetPath,
      rows,
      columns,
      0
    ).setTransform({ position: position });
    this.spriteMap.forceDraw = true;
    this.position = Vec2d.from(0, 0);
  }

  draw(resources: DrawingResources) {
    this.drawLayer(resources);
  }

  drawLayer(resources: DrawingResources) {
    let previousTile = -1;
    this.spriteMap.draw(resources);
    const spriteMapPosition = this.spriteMap.getTransform().getPosition();

    this.tiles.forEach((tileSet) => {
      tileSet.forEach((tile) => {
        // setup variables during first draw
        let position = tile.position;

        tile.tiles.forEach((row) => {
          row.forEach((cell) => {
            if (previousTile !== cell) {
              previousTile = cell;
              this.spriteMap.setSprite(cell);
            }

            if (
              resources.camera.isVisibleOnWC(spriteMapPosition.add(position))
            ) {
              this.spriteMap.fastDraw(position);
            }

            position = position.add(Vec2d.from(1, 0));
          });
          position = Vec2d.from(tile.position.x, position.y - 1);
        });
      });
    });
  }

  addBox(
    name: string,
    layer: number,
    position: Vec2d,
    width: number,
    height: number
  ) {
    const box = this.boxes.get(name);

    if (box === undefined) {
      throw new EngineError(TileMap.name, `Box name not found: ${name}`);
    }

    if (this.tiles.get(layer) === undefined) {
      this.tiles.set(0, []);
    }

    this.tiles.get(layer)?.push({ position, tiles: box.create(width, height) });
  }

  defineBox(name: string, topLeftCorner: number) {
    this.boxes.set(name, new TileBox(this.columns, topLeftCorner));
  }

  private drawBaseTile(resources: DrawingResources) {
    // Step A: Compute the positions and dimensions of tiling object.
    const size = Vec2d.from(0.85, 0.85);

    const left = this.position.x - size.x / 2;
    let right = left + size.x;
    let top = this.position.y + size.y / 2;
    const bottom = top - size.y;

    // Step B: Get WC positions and dimensions of the drawing camera.
    const wcPos = resources.camera.getTransform().getPosition();
    const wcSize = resources.camera.getTransform().getScale();

    const wcLeft = wcPos.x - wcSize.x / 2;
    const wcRight = wcLeft + wcSize.x;
    const wcBottom = wcPos.y - wcSize.y / 2;
    const wcTop = wcBottom + wcSize.y;

    // Step C: Determine offset to camera window's lower left corner.
    let dx = 0;
    let dy = 0;

    // left/right boundary?
    if (right < wcLeft) {
      // left of WC left
      dx = Math.ceil((wcLeft - right) / size.x) * size.x;
    } else {
      if (left > wcLeft) {
        // not touching the left side
        dx = -Math.ceil((left - wcLeft) / size.x) * size.x;
      }
    }

    // top/bottom boundary
    if (top < wcBottom) {
      // Lower than the WC bottom
      dy = Math.ceil((wcBottom - top) / size.y) * size.y;
    } else {
      if (bottom > wcBottom) {
        // not touching the bottom
        dy = -Math.ceil((bottom - wcBottom) / size.y) * size.y;
      }
    }

    // Step E: Offset tiling object and update related position variables
    //this.spriteMap.addToPosition(Vec2d.from(dx, dy));

    right = dx + size.x / 2;
    top = dy + size.y / 2;

    // Step F: Determine number of times to tile in x and y directions.
    const nx = Math.ceil((wcRight - right) / size.x);
    let ny = Math.ceil((wcTop - top) / size.y);

    // Step G: Loop through each location to draw a tile
    let cx = nx;

    // setup variables during first draw
    let position = Vec2d.from(0, 0);
    this.spriteMap.draw(resources);

    while (ny >= 0) {
      cx = nx;
      while (cx >= 0) {
        this.spriteMap.fastDraw(position);
        position = position.add(Vec2d.from(size.x, 0));
        cx--;
      }

      position = Vec2d.from(0, position.y + size.y);
      ny--;
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

  unload() {
    const component = this.spriteMap as IComponent;
    component.unload && component.unload();
  }
}
