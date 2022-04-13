import {
  GameObject,
  Audio,
  isKeyPressed,
  Keys,
  TextureRenderable,
  TransformDef,
  ResourceComponent,
  Behavior,
} from "../../engine";

const footCuePath = "/sounds/footstep.wav";
const pokemonTexturePath = "/textures/character.png";

export function buildCharacter(transformDef: TransformDef): GameObject {
  const character = new GameObject();

  // add the sprite!
  const renderable = new TextureRenderable(pokemonTexturePath);
  renderable.getTransform().setTransform(transformDef);
  character.add(renderable);

  // add sound
  const footCue = new ResourceComponent(footCuePath);
  character.add(footCue);

  // add behavior
  const updateAction = () => {
    const transform = renderable.getTransform();
    const speed = 0.08 * transform.getHorizontalScale();

    let isWalking = false;
    if (isKeyPressed(Keys.Left)) {
      transform.addToHorizontalPosition(-speed);
      isWalking = true;
    }
    if (isKeyPressed(Keys.Right)) {
      transform.addToHorizontalPosition(speed);
      isWalking = true;
    }
    if (isKeyPressed(Keys.Up)) {
      transform.addToVerticalPosition(speed);
      isWalking = true;
    }
    if (isKeyPressed(Keys.Down)) {
      transform.addToVerticalPosition(-speed);
      isWalking = true;
    }

    if (isWalking) {
      footCue.get<Audio>().playLoop();
    } else {
      footCue.get<Audio>().stop();
    }
  };
  character.add(new Behavior(updateAction));

  return character;
}
