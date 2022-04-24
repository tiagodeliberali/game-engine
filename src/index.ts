import { GameEngine } from "./engine";
import { buildInitialScene, pong } from "./examples";

const params = new URLSearchParams(window.location.search);

const gameName = params.get("game");

if (gameName === "pong") {
  const engine = new GameEngine(pong());
  engine.startGame();
} else if (gameName === "enderman") {
  const engine = new GameEngine(buildInitialScene());
  engine.startGame();
} else {
  document.body.insertAdjacentHTML(
    "afterbegin",
    `
    <div>
        Select a game: 
        <ul>
            <li><a href='http://localhost:9000?game=pong'>Pong</a></li>
            <li><a href='http://localhost:9000?game=enderman'>Enderman</a></li>
        </ul>
    </div>`
  );
}
