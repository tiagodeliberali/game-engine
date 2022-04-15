import {
  GameObject,
  Audio,
  TextureRenderable,
  TransformDef,
  ResourceComponent,
  walk2d,
} from "../../engine";

const footCuePath = "/sounds/footstep.wav";
const pokemonTexturePath = "/textures/character.png";

export function buildCharacter(transformDef: TransformDef): GameObject {
  const character = new GameObject();

  // add the sprite!
  const renderable = new TextureRenderable(pokemonTexturePath);
  renderable.setTransform(transformDef);
  character.add(renderable);

  // add sound
  const footCue = new ResourceComponent(footCuePath);
  character.add(footCue);

  // add a behavior
  character.add(
    walk2d(renderable, 0.08, (isWalking) => {
      if (isWalking) {
        footCue.get<Audio>().playLoop();
      } else {
        footCue.get<Audio>().stop();
      }
    })
  );

  return character;
}
