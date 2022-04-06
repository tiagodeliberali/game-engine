import { GameEngine } from "./engine";
import { InitialScene } from "./my_game";

const initialScene = new InitialScene();

const engine = new GameEngine(initialScene);
engine.startGame();
