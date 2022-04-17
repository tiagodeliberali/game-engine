import { GameEngine } from "./engine";
import { pong } from "./my_game";

const engine = new GameEngine(pong());
engine.startGame();
