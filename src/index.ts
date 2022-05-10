import { GameEngine } from "./engine";
import { buildInitialScene, findEggs, pong } from "./examples";

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

// const check = () => {
//   const loop_size = 1_000_000_000;
//   log(`Starting with iteration size of ${loop_size}}`);

//   /// Empty loop time
//   ///////////////////////////////
//   let emptyLoopTime = performance.now();
//   for (let i = 0; i < loop_size; i++) {
//     // do nothing
//   }
//   emptyLoopTime = performance.now() - emptyLoopTime;

//   log(`Empty loop: ${emptyLoopTime}`);

//   /// Reuse of memory
//   ///////////////////////////////
//   const matrix = [0, 0, 0];
//   const object = {
//     x: 0,
//     y: 0,
//     z: 0,
//   };
//   let reuseMemoryLoop = performance.now();
//   for (let i = 0; i < loop_size; i++) {
//     matrix[0] = i;
//     matrix[1] = i + 2;
//     matrix[2] = i * 3;

//     object.x = i;
//     object.y = i + 3;
//     object.z = i * 3;

//     // 2
//     matrix[0] = i;
//     matrix[1] = i + 2;
//     matrix[2] = i * 3;

//     object.x = i;
//     object.y = i + 3;
//     object.z = i * 3;

//     // 3
//     matrix[0] = i;
//     matrix[1] = i + 2;
//     matrix[2] = i * 3;

//     object.x = i;
//     object.y = i + 3;
//     object.z = i * 3;

//     // 4
//     matrix[0] = i;
//     matrix[1] = i + 2;
//     matrix[2] = i * 3;

//     object.x = i;
//     object.y = i + 3;
//     object.z = i * 3;

//     // 5
//     matrix[0] = i;
//     matrix[1] = i + 2;
//     matrix[2] = i * 3;

//     object.x = i;
//     object.y = i + 3;
//     object.z = i * 3;

//     // 6
//     matrix[0] = i;
//     matrix[1] = i + 2;
//     matrix[2] = i * 3;

//     object.x = i;
//     object.y = i + 3;
//     object.z = i * 3;

//     // 7
//     matrix[0] = i;
//     matrix[1] = i + 2;
//     matrix[2] = i * 3;

//     object.x = i;
//     object.y = i + 3;
//     object.z = i * 3;

//     // 8
//     matrix[0] = i;
//     matrix[1] = i + 2;
//     matrix[2] = i * 3;

//     object.x = i;
//     object.y = i + 3;
//     object.z = i * 3;

//     // 9
//     matrix[0] = i;
//     matrix[1] = i + 2;
//     matrix[2] = i * 3;

//     object.x = i;
//     object.y = i + 3;
//     object.z = i * 3;

//     // 10
//     matrix[0] = i;
//     matrix[1] = i + 2;
//     matrix[2] = i * 3;

//     object.x = i;
//     object.y = i + 3;
//     object.z = i * 3;
//   }
//   reuseMemoryLoop = performance.now() - reuseMemoryLoop;

//   log(`Reuse of memory loop: ${reuseMemoryLoop}`);

//   /// Heap instantiation
//   ///////////////////////////////
//   let heapInstantiationLoopTime = performance.now();
//   for (let i = 0; i < loop_size; i++) {
//     const matrix = [i, i + 2, i * 3];
//     const object = {
//       x: i,
//       y: i + 3,
//       z: i * 3,
//     };

//     const matrix2 = [i, i + 2, i * 3];
//     const object2 = {
//       x: i,
//       y: i + 3,
//       z: i * 3,
//     };

//     const matrix3 = [i, i + 2, i * 3];
//     const object3 = {
//       x: i,
//       y: i + 3,
//       z: i * 3,
//     };

//     const matrix4 = [i, i + 2, i * 3];
//     const object4 = {
//       x: i,
//       y: i + 3,
//       z: i * 3,
//     };

//     const matrix5 = [i, i + 2, i * 3];
//     const object5 = {
//       x: i,
//       y: i + 3,
//       z: i * 3,
//     };

//     const matrix6 = [i, i + 2, i * 3];
//     const object6 = {
//       x: i,
//       y: i + 3,
//       z: i * 3,
//     };

//     const matrix7 = [i, i + 2, i * 3];
//     const object7 = {
//       x: i,
//       y: i + 3,
//       z: i * 3,
//     };

//     const matrix8 = [i, i + 2, i * 3];
//     const object8 = {
//       x: i,
//       y: i + 3,
//       z: i * 3,
//     };

//     const matrix9 = [i, i + 2, i * 3];
//     const object9 = {
//       x: i,
//       y: i + 3,
//       z: i * 3,
//     };

//     const matrix10 = [i, i + 2, i * 3];
//     const object10 = {
//       x: i,
//       y: i + 3,
//       z: i * 3,
//     };
//   }
//   heapInstantiationLoopTime = performance.now() - heapInstantiationLoopTime;

//   log(`heap instantiation loop: ${heapInstantiationLoopTime}`);
// };

// const log = (message: string) => {
//   console.log(message);
//   document.body.insertAdjacentHTML("beforeend", `<p>${message}</p>`);
// };

// document.body.insertAdjacentHTML(
//   "afterbegin",
//   `<button id='check'>Click me!</button>`
// );

// const button = document.getElementById("check") as HTMLButtonElement;
// if (button !== null) {
//   button.addEventListener("click", () => check());
// }
