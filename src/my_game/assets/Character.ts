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

export function buildCharacter(characterTransform: TransformDef): GameObject {
  const character = new GameObject();

  // add the sprite!
  const renderable = new TextureRenderable(pokemonTexturePath);
  character.add(renderable);

  // add sound
  const footCue = new ResourceComponent(footCuePath);
  character.add(footCue);

  // add a behavior
  character.add(
    walk2d(character, 0.08, (isWalking) => {
      if (isWalking) {
        footCue.get<Audio>().playLoop();
      } else {
        footCue.get<Audio>().stop();
      }
    })
  );

  character.setTransform(characterTransform);

  return character;
}
