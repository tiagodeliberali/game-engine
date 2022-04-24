import { GameEngine } from "./engine";
import { buildInitialScene, findEggs, pong } from "./examples";
import { getDocs } from "./docs";

const params = new URLSearchParams(window.location.search);

const gameName = params.get("game");

if (gameName === "pong") {
  const engine = new GameEngine(pong());
  engine.startGame();
} else if (gameName === "enderman") {
  const engine = new GameEngine(buildInitialScene());
  engine.startGame();
} else if (gameName === "findeggs") {
  const engine = new GameEngine(findEggs());
  engine.startGame();
} else if (gameName === "docs") {
  const contentName = params.get("content");
  const { index, content } = getDocs(contentName || "index");
  document.body.insertAdjacentHTML("afterbegin", index.getIndex());
  document.body.insertAdjacentHTML("beforeend", content.getHtml());
} else {
  document.body.insertAdjacentHTML(
    "afterbegin",
    `
    <div>
        Select a game: 
        <ul>
            <li><a href='http://localhost:9000?game=pong'>Pong</a></li>
            <li><a href='http://localhost:9000?game=enderman'>Enderman</a></li>
            <li><a href='http://localhost:9000?game=findeggs'>Find eggs</a></li>
        </ul>
    </div>`
  );
}
