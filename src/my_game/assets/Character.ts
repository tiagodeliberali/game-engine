import {
  GameObject,
  Audio,
  isKeyPressed,
  Keys,
  TextureRenderable,
  TransformDef,
} from "../../engine";

const footCuePath = "/sounds/footstep.wav";
const pokemonTexturePath = "/textures/character.png";

export class Character extends GameObject {
  footCue: Audio | undefined;
  transform: TransformDef;

  constructor(transform: TransformDef) {
    super();
    this.transform = transform;

    const renderable = new TextureRenderable(pokemonTexturePath);
    renderable.getTransform().setTransform(this.transform);

    this.setRenderable(renderable);
  }

  load() {
    super.load();
    this.loadResource(footCuePath);
  }

  init() {
    super.init();
    this.footCue = this.getResource<Audio>(footCuePath);
  }

  update() {
    const speed = 0.08 * this.transform.scale.x;
    const transform = this.getRenderable<TextureRenderable>().getTransform();

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
