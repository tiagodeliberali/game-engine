export type ColorDef = {
  red: number;
  green: number;
  blue: number;
  alpha?: number;
};

export class Color {
  readonly red: number;
  readonly green: number;
  readonly blue: number;
  readonly alpha: number;

  private constructor(red: number, green: number, blue: number, alpha: number) {
    this.red = red;
    this.green = green;
    this.blue = blue;
    this.alpha = alpha;
  }

  static FromColorDef(colorDef: ColorDef) {
    return new Color(
      colorDef.red,
      colorDef.green,
      colorDef.blue,
      colorDef.alpha === undefined ? 1 : colorDef.alpha
    );
  }

  static random(): Color {
    return new Color(
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
      1
    );
  }

  static Transparent(): Color {
    return Color.FromColorDef({
      red: 0,
      green: 0,
      blue: 0,
      alpha: 0,
    });
  }

  static Black() {
    return Color.FromColorDef({
      red: 0,
      green: 0,
      blue: 0,
    });
  }

  static LightGray() {
    return Color.FromColorDef({
      red: 230,
      green: 230,
      blue: 230,
    });
  }

  static White() {
    return Color.FromColorDef({
      red: 255,
      green: 255,
      blue: 255,
    });
  }

  getRedNormalized() {
    return this.red / 255;
  }

  getGreenNormalized() {
    return this.green / 255;
  }

  getBlueNormalized() {
    return this.blue / 255;
  }

  getNormalizedArray() {
    return [
      this.getRedNormalized(),
      this.getGreenNormalized(),
      this.getBlueNormalized(),
      this.alpha,
    ];
  }
}
