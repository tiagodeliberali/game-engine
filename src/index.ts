import { GameEngine } from "./engine";
import { pong } from "./my_game";

pong([0, 0]).then((x) => {
  const engine = new GameEngine(x);
  engine.startGame();
});
