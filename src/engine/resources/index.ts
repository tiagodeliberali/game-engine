import { ResourceManager } from "./ResourceManager";
import { IResourceProcessor } from "./IResourceProcessor";
import { AudioProcessor } from "./AudioProcessor";
import { Audio } from "./Audio";
import { TextProcessor } from "./TextProcessor";

let resourceManager: ResourceManager | undefined;

function getResourceManager() {
  if (resourceManager === undefined) {
    resourceManager = new ResourceManager();
    resourceManager.addResourceProcessor(new TextProcessor());
    resourceManager.addResourceProcessor(new AudioProcessor());
  }

  return resourceManager;
}

export { getResourceManager, Audio };
export type { IResourceProcessor as ResourceProcessor };
