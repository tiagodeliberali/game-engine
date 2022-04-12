import {
  GameObject,
  Audio,
  Texture,
  isKeyPressed,
  Keys,
  TextureRenderable,
  TransformDef,
} from "../../engine";

const footCuePath = "/sounds/footstep.wav";
const pokemonTexturePath = "/textures/character.png";

export class Character extends GameObject {
  footCue: Audio | undefined;
  characterTexture: Texture | undefined;
  transform: TransformDef;

  constructor(transform: TransformDef) {
    super();
    this.transform = transform;
  }

  load() {
    this.loadResource(footCuePath);
    this.loadResource(pokemonTexturePath);
  }

  init() {
    this.footCue = this.getResource<Audio>(footCuePath);
    this.characterTexture = this.getResource<Texture>(pokemonTexturePath);

    this.renderable = new TextureRenderable(this.characterTexture!);
    this.renderable.getTransform().setTransform(this.transform);
  }

  update() {
    const speed = 0.08 * this.transform.scale.x;
    const transform = this.renderable!.getTransform();

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
      this.footCue!.playLoop();
    } else {
      this.footCue!.stop();
    }
  }
}
