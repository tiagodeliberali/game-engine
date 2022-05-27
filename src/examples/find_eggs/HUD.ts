import { FontRenderable, GameObject, Vec2d } from "../../engine";

export type HUD = {
  updateText: (message: string) => void;
  gameObject: GameObject;
};

export const createHUD = (): HUD => {
  const messageText = FontRenderable.getDefaultFont("Find the eggs!")
    .setColor({ red: 200, green: 200, blue: 200 })
    .setTransform({
      position: Vec2d.from(-7.3, 3.4),
      scale: Vec2d.from(0.3, 0.3),
    })
    .setFrozenCamera(true);
  const gameText = new GameObject();
  gameText.add(messageText);

  return {
    updateText: (message: string) => messageText.setText(message),
    gameObject: gameText,
  };
};
