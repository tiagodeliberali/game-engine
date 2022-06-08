import { TileTypeConfiguration, TileMapBoard } from ".";
import { EngineError, Vec2d } from "..";
import { TileType } from "./TileType";
import { ITileTracer } from "./tracer";

type TileSet = {
  position: Vec2d;
  tiles: TileMapBoard;
};

/**
 * To reason about tile map editor, we organize it into layers. Each layer is associated to a single TileTypeConfiguration.
 * The build process consists in:
 *  - create an empty tilemap with rows x columns filled with layer 0 paths
 *  - process layer on order of inclusion, merging all tracings and overriding the content of the tile map
 */
export class TileMapEditor {
  defaultType: TileType;
  layers: TileTypeConfiguration[] = [];
  layerTracings: Map<number, TileSet[]> = new Map();
  rows: number;
  columns: number;

  constructor(rows: number, columns: number, baseLayer: TileTypeConfiguration) {
    this.rows = rows;
    this.columns = columns;
    this.layers.push(baseLayer);
    this.defaultType = TileType.JustWall;
  }

  createLayer(typeConfig: TileTypeConfiguration) {
    this.layers.push(typeConfig);
  }

  trace(layerNumber: number, position: Vec2d, tracer: ITileTracer) {
    const layer = this.layers[layerNumber];

    if (layer === undefined) {
      throw new EngineError(
        TileMapEditor.name,
        `Layer ${layerNumber} is not defined.`
      );
    }

    if (this.layerTracings.get(layerNumber) === undefined) {
      this.layerTracings.set(layerNumber, []);
    }

    this.layerTracings
      .get(layerNumber)
      ?.push({ position, tiles: tracer.draw() });
  }

  build(): TileMapBoard {
    const board = new TileMapBoard(this.rows, this.columns);

    for (let layerNumber = 0; layerNumber < this.layers.length; layerNumber++) {
      const tiles = this.layerTracings.get(layerNumber);
      if (tiles === undefined) {
        continue;
      }

      const layerBoard = new TileMapBoard(this.rows, this.columns);
      const layerConfig = this.layers[layerNumber];

      tiles.forEach((tileSet) => {
        layerBoard.merge(tileSet.position, tileSet.tiles);
      });

      layerBoard.forEachCell((cell) => {
        if (cell.type !== TileType.Empty) {
          cell.spriteSheetPosition = layerConfig.get(cell.type);
        }
      });

      board.overrideBy(Vec2d.from(0, 0), layerBoard);
    }

    board.forEachCell((cell) => {
      if (cell.type === TileType.Empty) {
        cell.type = this.defaultType;
        cell.spriteSheetPosition = this.layers[0].get(cell.type);
      }
    });

    return board;
  }
}
