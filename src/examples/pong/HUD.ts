import { FontRenderable, GameObject, Vec2d } from "../../engine";

const pausedText = "Paused";
const score = [0, 0];
let paused = false;

export type HUD = {
  getScore: (player: number) => number;
  togglePause: () => void;
  updateMessage: (message: string) => void;
  hideMessage: () => void;
  updateScore: (player: number) => void;
  resetScore: () => void;
};

export const createHUD = () => {
  const messageText = FontRenderable.getDefaultFont("")
    .setColor({ red: 100, green: 200, blue: 100, alpha: 1 })
    .setTransform({
      position: Vec2d.from(40, 25),
      scale: Vec2d.from(5, 5),
    });

  const scoreText = FontRenderable.getDefaultFont("0 - 0")
    .setColor({ red: 100, green: 200, blue: 100, alpha: 1 })
    .setTransform({
      position: Vec2d.from(48, 48),
      scale: Vec2d.from(2, 2),
    });

  const hudGameObject = new GameObject();

  hudGameObject.add(messageText);
  hudGameObject.add(scoreText);

  const hud = {
    getScore: (player: number) => score[player],
    updateMessage: (message: string) => !paused && messageText.setText(message),
    hideMessage: () => !paused && messageText.setText(""),
    updateScore: (player: number) => {
      score[player] += 1;
      scoreText.setText(`${score[0]} - ${score[1]}`);
    },
    resetScore: () => {
      score[0] = 0;
      score[1] = 0;
      scoreText.setText(`${score[0]} - ${score[1]}`);
    },
    togglePause: () => {
      paused = !paused;

      if (paused) {
        messageText.setText(pausedText);
      } else {
        messageText.setText("");
      }
    },
  };

  return { hud, hudGameObject };
};
