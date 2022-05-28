import { IComponent, SpriteRenderable, Vec2d } from "..";
import { DrawingResources } from "../core";

export class TileMap implements IComponent {
  spriteSheetPath: string;
  spriteMap: SpriteRenderable;
  position: Vec2d;

  constructor(
    spriteSheetPath: string,
    rows: number,
    columns: number,
    baseSpritePosition: number
  ) {
    this.spriteSheetPath = spriteSheetPath;
    this.spriteMap = SpriteRenderable.build(
      this.spriteSheetPath,
      rows,
      columns,
      baseSpritePosition
    );
    this.position = Vec2d.from(0, 0);
  }

  draw(resources: DrawingResources) {
    this.drawBaseTile(resources);
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
    this.spriteMap.addToPosition(Vec2d.from(dx, dy));

    right = dx + size.x / 2;
    top = dy + size.y / 2;

    // Step F: Determine number of times to tile in x and y directions.
    const nx = Math.ceil((wcRight - right) / size.x);
    let ny = Math.ceil((wcTop - top) / size.y);

    // Step G: Loop through each location to draw a tile
    let cx = nx;
    const xPos = dx;

    while (ny >= 0) {
      cx = nx;
      while (cx >= 0) {
        this.spriteMap.draw(resources);
        this.spriteMap.addToPosition(Vec2d.from(size.x, 0));
        cx--;
      }

      const position = this.spriteMap.getTransform().getPosition();
      this.spriteMap.setTransform({
        position: Vec2d.from(xPos, position.y + size.y),
      });

      ny--;
    }

    // Step H: Reset the tiling object to its original position.
    this.spriteMap.setTransform({ position: this.position });
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
    this.spriteMap.unload();
  }
}
