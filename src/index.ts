import { GameEngine } from "./engine";
import { CenaInicial } from "./my_game";

const cenaInicial = new CenaInicial();

const engine = new GameEngine(cenaInicial);
engine.start();
