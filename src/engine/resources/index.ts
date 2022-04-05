import { ResourceManager, IResourceProcessor } from "./ResourceManager";

let resourceManager: ResourceManager | undefined;

function GetResourceManager() {
  if (resourceManager === undefined) {
    resourceManager = new ResourceManager();
  }

  return resourceManager;
}

export { GetResourceManager };
export type { IResourceProcessor as ResourceProcessor };
