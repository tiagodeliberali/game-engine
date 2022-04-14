import { GameEngine } from "./engine";
import { buildInitialScene } from "./my_game";

const engine = new GameEngine(buildInitialScene());
engine.startGame();
