import { ResourceManager } from "./ResourceManager";
import { ResourceProcessor } from "./ResourceProcessor";
import { AudioProcessor } from "./AudioProcessor";
import { Audio } from "./Audio";
import { TextProcessor } from "./TextProcessor";
import { TextureProcessor } from "./TextureProcessor";
import { Texture } from "./Texture";
import { MapEntry } from "./MapEntry";

let resourceManager: ResourceManager | undefined;

function getResourceManager() {
  if (resourceManager === undefined) {
    resourceManager = new ResourceManager();
    resourceManager.addResourceProcessor(new TextProcessor());
    resourceManager.addResourceProcessor(new AudioProcessor());
    resourceManager.addResourceProcessor(new TextureProcessor());
  }

  return resourceManager;
}

export { getResourceManager, Audio, Texture, MapEntry, ResourceProcessor };
