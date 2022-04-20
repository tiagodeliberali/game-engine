# game-engine

A 2d game engine based on WebGL and typescript

Based on the book `Build Your Own 2D Game Engine and Create Great Web Games: Using HTML5, JavaScript, and WebGL2`

Also, great inspiration from `Real-Time 3D Graphics with WebGL 2 - Second Edition`! Great content on WebGL.

# build

> npm install
>
> npm run build

You can launch a local server with hot reload using `npm run server`

# commit

Run pretty and lint before commiting to the repo:

> npm run all

# Basic concepts

To make it easier to reason about names, I am adding the definitions bellow and I tried hard to follow them:

- Load: Get external resources using `ResourceManager`.
- Init: Executed once in a context, after all resources loaded.
- Update: Run every loop cycle and should not draw. Can run more than once in a loop cycle.
- Draw: Run every loop cycle.
- Unload: clear resources

# IComponent

Basic component that ties to the engine lifecycle. Contains the basic actions necessary to be added to the GameObject. Even the GameObject implements this interface.

# WebGL

All WebGL content is stored inside `graphics` module.
