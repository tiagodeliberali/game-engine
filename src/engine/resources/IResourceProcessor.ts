import { MapEntry } from "./MapEntry";

export interface IResourceProcessor {
  extensions: () => string[];
  decode: (data: Response) => Promise<unknown>;
  parse: (data: unknown) => Promise<MapEntry>;
}
