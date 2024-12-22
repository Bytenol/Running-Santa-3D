import { getImage, loadAssets } from "./Loader.js";
import { setupWindowSize, getProgram, resetContext, getContext, initRenderer } from "./Renderer.js";
import { createTextureFromImage, setTexture, setupTextureLocation } from "./texture.js";
import * as mat4 from "./mat4.js";
import InstancedRenderer from "./InstancedRenderer.js";
import Moveable from "./Moveable.js";
import initEvent from "./eventHandler.js";

const allAssetInfo = [
    { name: "starfield", url: "starfield.png", type: "image" },
    { name: "wall", url: "wall.png", type: "image" },
    { name: "santa", url: "santa.png", type: "image" },
    { name: "santa_blink", url: "santa_flying.png", type: "image" },

    { name: "aa", url: "aa.PNG", type: "image" },
    { name: "aboutScreen", url: "aboutScreen.png", type: "image" },
    { name: "back_button", url: "back_button.png", type: "image" },
    { name: "blocks", url: "blocks.png", type: "image" },
    { name: "connText", url: "connText.png", type: "image" },
];


const getImageRectData = (sx: number, sy: number, sw: number, sh: number) => {
    return [
        -0.5, -0.5,  0.5,  sx, sy,     0.0,  0.0,  1.0, // Bottom-left
        0.5, -0.5,  0.5,  sx+sw, sy,     0.0,  0.0,  1.0, // Bottom-right
        0.5,  0.5,  0.5,  sx+sw, sy+sh,     0.0,  0.0,  1.0, // Top-right
    
        -0.5, -0.5,  0.5,  sx,sy,     0.0,  0.0,  1.0, // Bottom-left
        0.5,  0.5,  0.5,  sx+sw, sy+sh,     0.0,  0.0,  1.0, // Top-right
        -0.5,  0.5,  0.5,  sx, sy+sh,     0.0,  0.0,  1.0, // Top-left
    ]
}

const cubeData = [
    // Positions       // TexCoords   // Normals
    // front face
    -0.5, -0.5,  0.5,  0.0, 0.0,     0.0,  0.0,  1.0, // Bottom-left
    0.5, -0.5,  0.5,  1.0, 0.0,     0.0,  0.0,  1.0, // Bottom-right
    0.5,  0.5,  0.5,  1.0, 1.0,     0.0,  0.0,  1.0, // Top-right

-0.5, -0.5,  0.5,  0.0, 0.0,     0.0,  0.0,  1.0, // Bottom-left
    0.5,  0.5,  0.5,  1.0, 1.0,     0.0,  0.0,  1.0, // Top-right
-0.5,  0.5,  0.5,  0.0, 1.0,     0.0,  0.0,  1.0, // Top-left

// Back face
-0.5, -0.5, -0.5,  0.0, 0.0,     0.0,  0.0, -1.0, // Bottom-left
-0.5,  0.5, -0.5,  0.0, 1.0,     0.0,  0.0, -1.0, // Top-left
    0.5,  0.5, -0.5,  1.0, 1.0,     0.0,  0.0, -1.0, // Top-right

-0.5, -0.5, -0.5,  0.0, 0.0,     0.0,  0.0, -1.0, // Bottom-left
    0.5,  0.5, -0.5,  1.0, 1.0,     0.0,  0.0, -1.0, // Top-right
    0.5, -0.5, -0.5,  1.0, 0.0,     0.0,  0.0, -1.0, // Bottom-right

// Top face
-0.5,  0.5, -0.5,  0.0, 0.0,     0.0,  1.0,  0.0, // Bottom-left
-0.5,  0.5,  0.5,  0.0, 1.0,     0.0,  1.0,  0.0, // Top-left
    0.5,  0.5,  0.5,  1.0, 1.0,     0.0,  1.0,  0.0, // Top-right

-0.5,  0.5, -0.5,  0.0, 0.0,     0.0,  1.0,  0.0, // Bottom-left
    0.5,  0.5,  0.5,  1.0, 1.0,     0.0,  1.0,  0.0, // Top-right
    0.5,  0.5, -0.5,  1.0, 0.0,     0.0,  1.0,  0.0, // Bottom-right

// Bottom face
-0.5, -0.5, -0.5,  0.0, 0.0,     0.0, -1.0,  0.0, // Bottom-left
    0.5, -0.5,  0.5,  1.0, 1.0,     0.0, -1.0,  0.0, // Top-right
-0.5, -0.5,  0.5,  0.0, 1.0,     0.0, -1.0,  0.0, // Top-left

-0.5, -0.5, -0.5,  0.0, 0.0,     0.0, -1.0,  0.0, // Bottom-left
    0.5, -0.5, -0.5,  1.0, 0.0,     0.0, -1.0,  0.0, // Bottom-right
    0.5, -0.5,  0.5,  1.0, 1.0,     0.0, -1.0,  0.0, // Top-right

// Right face
    0.5, -0.5, -0.5,  0.0, 0.0,     1.0,  0.0,  0.0, // Bottom-left
    0.5,  0.5, -0.5,  1.0, 0.0,     1.0,  0.0,  0.0, // Top-left
    0.5,  0.5,  0.5,  1.0, 1.0,     1.0,  0.0,  0.0, // Top-right

    0.5, -0.5, -0.5,  0.0, 0.0,     1.0,  0.0,  0.0, // Bottom-left
    0.5,  0.5,  0.5,  1.0, 1.0,     1.0,  0.0,  0.0, // Top-right
    0.5, -0.5,  0.5,  0.0, 1.0,     1.0,  0.0,  0.0, // Bottom-right

// Left face
-0.5, -0.5, -0.5,  0.0, 0.0,    -1.0,  0.0,  0.0, // Bottom-left
-0.5, -0.5,  0.5,  1.0, 0.0,    -1.0,  0.0,  0.0, // Bottom-right
-0.5,  0.5,  0.5,  1.0, 1.0,    -1.0,  0.0,  0.0, // Top-right

-0.5, -0.5, -0.5,  0.0, 0.0,    -1.0,  0.0,  0.0, // Bottom-left
-0.5,  0.5,  0.5,  1.0, 1.0,    -1.0,  0.0,  0.0, // Top-right
-0.5,  0.5, -0.5,  0.0, 1.0,    -1.0,  0.0,  0.0, // Top-left
];


const location: {
    projection: WebGLUniformLocation | null,
    view: WebGLUniformLocation | null,
    model: WebGLUniformLocation | null
} = {
    projection: null,
    view: null,
    model: null,
}


const floor: any = {
    pos: [],
    instancedRenderer: null,

    update(dt: number) {
        const instancedData: number[] = [];
        floor.pos.forEach((p: any) => {
            p.z += Moveable.speed * dt;
            if(p.z > 5) 
                p.z = -50;
            instancedData.push(p.x, p.y, p.z);
        });

        floor.instancedRenderer.setInstancedData(instancedData);
    }
};


const randRange = (min: number, max: number) => Math.random() * (max - min + 1) + min;


const cube: any = {
    spawnDueTime: 1.5,
    currTime: 0,
    pos: [],
    instancedRenderer: null,

    spawn(dt: number) {
        cube.currTime += dt;
        if(cube.currTime >= cube.spawnDueTime) {
            cube.currTime = 0;
            cube.spawnDueTime = randRange(1.5, 2.5);
            let amt = Math.floor(randRange(2, 4));
            let z = -50;
            for(let i = 0; i < amt; i++) {
                const ind = [-2, -1, 0, 1, 2];
                const chosenIndex = ind[Math.floor(Math.random() * ind.length)];
                cube.pos.push({x: chosenIndex, y: 0, z: z});
            }
        }
    },

    update(dt: number) {
        const instancedData: number[] = [];
        cube.spawn(dt);
        cube.pos.forEach((p: any, i: number) => {
            p.z += Moveable.speed * dt;
            if(p.z > 5) cube.pos.splice(i, 1);
            else instancedData.push(p.x, p.y, p.z);
        });

        cube.instancedRenderer.setInstancedData(instancedData);
    }

};


const santa: any = {

    pos: {x: 0, y: 0, z: -2},
    instancedRenderer: null,
    sx: 0,
    spriteCounter: 0,
    animMaxSpeed: 4,
    vy: 0,

    init(gl: WebGL2RenderingContext) {
        santa.pos.x = 0;
        santa.pos.y = 0;
        santa.pos.z = -2;
        const position = getImageRectData(0, 0, 1/6, 1);
        santa.instancedRenderer = new InstancedRenderer(gl, position, 50 * Float32Array.BYTES_PER_ELEMENT);
    },

    update(dt: number) {
        if(santa.pos.x < -2) santa.pos.x = -2;
        if(santa.pos.x > 2) santa.pos.x = 2;
        if(santa.pos.y < 0) {
            santa.vy = 0;
        }
        santa.spriteCounter++;
        if(santa.spriteCounter >= santa.animMaxSpeed) {
            santa.spriteCounter = 0;
            santa.sx += 1/6;
        }
        const position = getImageRectData(santa.sx, 0, 1/6, 1);
        santa.instancedRenderer.setBufferData(position);
        santa.instancedRenderer.setInstancedData([santa.pos.x, santa.pos.y, santa.pos.z]);
    }

}


const eventHandler = () => {
    window.addEventListener("keyup", e => {
        switch(e.key.toLocaleLowerCase()) {
            case "arrowleft":
                santa.pos.x--;
                break;
            case "arrowright":
                santa.pos.x++;
                break;
            case "space":
                santa.vy = 20;
                break;
        }
    })
}


const init = (gl: WebGL2RenderingContext, w: number, h: number) => {
    resetContext(w, h);
    const program = getProgram("basic");
    gl.useProgram(program);
    location.projection = gl.getUniformLocation(program, "mProjection") as WebGLUniformLocation;
    location.view = gl.getUniformLocation(program, "mView") as WebGLUniformLocation;
    location.model = gl.getUniformLocation(program, "mModel") as WebGLUniformLocation;

    const mProjection = mat4.perspective(45 * Math.PI / 180, gl.canvas.width/gl.canvas.height, 0.1, 50);
    gl.uniformMatrix4fv(location.projection, false, mProjection);
    gl.uniformMatrix4fv(location.view, false, mat4.create());
    gl.uniformMatrix4fv(location.model, false, mat4.create());

    initTexture(gl, program);

    cube.instancedRenderer = new InstancedRenderer(gl, cubeData, 50 * Float32Array.BYTES_PER_ELEMENT);
    cube.pos.push(
        {x: 0, y: 0, z: -30},
        {x: 1, y: 0, z: -30},
        {x: 2, y: 0, z: -30},
    );
    
    floor.instancedRenderer = new InstancedRenderer(gl, cubeData, 500 * 5 * Float32Array.BYTES_PER_ELEMENT);
    for(let z = 5; z > -50; z--) {
        for(let x = -2; x <= 2; x++) {
            floor.pos.push({ x, y: -1, z });
        }
    }

    santa.init(gl);
}


const update = (dt: number) => {
    const speed = Moveable.speed = 4;
    floor.update(dt);
    cube.update(dt);
    santa.update(dt);
}

const draw = (gl: WebGL2RenderingContext) => {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const program = getProgram("basic");
    gl.useProgram(program);

    const camera = mat4.lookAt([0, 0.7, 2], [santa.pos.x, santa.pos.y, santa.pos.z], [0, 1, 0]);
    gl.uniformMatrix4fv(location.view, false, new Float32Array(camera));

    setTexture("blocks");
    cube.instancedRenderer.render();

    setTexture("wall");
    floor.instancedRenderer.render();

    setTexture("santa");
    santa.instancedRenderer.render();

}


const mainLoop = (gl: WebGL2RenderingContext) => {
    const loop = () => {
        draw(gl);
        let dt = 1 / 60;
        update(dt);
        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
}


const main = async () => {
    await loadAssets("./assets/", allAssetInfo);
    const {width, height} = setupWindowSize();
    initRenderer("gl", width, height);
    const gl = getContext();
    init(gl, width, height);
    mainLoop(gl);
    initEvent();
    eventHandler();
}

addEventListener("load", main);


const initTexture = (gl: WebGL2RenderingContext, program: WebGLProgram) => {
    setupTextureLocation(gl.getUniformLocation(program, "u_texture") as WebGLUniformLocation);
    allAssetInfo.forEach((info) => createTextureFromImage(gl, info.name));
}