import {
  GameObject,
  Audio,
  TextureRenderable,
  TransformDef,
  ResourceComponent,
  walk2d,
  ITransformable,
} from "../../../engine";

const footCuePath = "/sounds/footstep.wav";
const pokemonTexturePath = "/textures/character.png";

export function buildCharacter(characterTransform: TransformDef) {
  const characterGameObject = new GameObject();

  // add sound
  const footCue = new ResourceComponent(footCuePath);
  characterGameObject.add(footCue);

  // add the sprite!
  const characterHelper = characterGameObject
    .add(
      TextureRenderable.build(pokemonTexturePath).setTransform(
        characterTransform
      )
    )
    .withBehavior<ITransformable>((character) =>
      walk2d(character, 0.08, (isWalking) => {
        if (isWalking) {
          footCue.get<Audio>().playLoop();
        } else {
          footCue.get<Audio>().stop();
        }
      })
    );

  return { characterGameObject, characterHelper };
}
