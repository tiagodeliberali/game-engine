type ColorDef = { red: number; green: number; blue: number };

export class Color {
  red: number;
  green: number;
  blue: number;

  private constructor() {
    this.red = 0;
    this.green = 0;
    this.blue = 0;
  }

  public static FromColorDef(colorDef: ColorDef) {
    const color = new Color();
    color.red = colorDef.red;
    color.green = colorDef.green;
    color.blue = colorDef.blue;

    return color;
  }

  public static Black() {
    return new Color();
  }

  public static LightGray() {
    return Color.FromColorDef({
      red: 230,
      green: 230,
      blue: 230,
    });
  }

  public set(colorDef: ColorDef) {
    this.red = colorDef.red;
    this.green = colorDef.green;
    this.blue = colorDef.blue;
  }

  public getRedNormalized() {
    return this.red / 255;
  }

  public getGreenNormalized() {
    return this.green / 255;
  }

  public getBlueNormalized() {
    return this.blue / 255;
  }

  public getNormalizedArray() {
    return [
      this.getRedNormalized(),
      this.getGreenNormalized(),
      this.getBlueNormalized(),
      1,
    ];
  }
}
