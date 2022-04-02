import { Game } from "./my_game/Game";

window.onload = function () {
  const game = new Game("GLCanvas");
  game.init();
};
