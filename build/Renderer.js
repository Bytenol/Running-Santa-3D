;
let gl;
let gameState = 0 /* GameState.MENU */;
const programs = {};
const setGameState = (state) => {
    gameState = state;
};
const getGameState = () => gameState;
const createShader = (gl, type, src) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error((type === gl.VERTEX_SHADER ? "VERTEX_SHADER" : "FRAGMENT_SHADER") +
            `::${gl.getShaderInfoLog(shader)}`);
        gl.deleteShader(shader);
        return null;
    }
    return shader;
};
const createProgram = (gl, name, vSource, fSource) => {
    const vShader = createShader(gl, gl.VERTEX_SHADER, vSource);
    const fShader = createShader(gl, gl.FRAGMENT_SHADER, fSource);
    programs[name] = gl.createProgram();
    gl.attachShader(programs[name], vShader);
    gl.attachShader(programs[name], fShader);
    gl.linkProgram(programs[name]);
    if (!gl.getProgramParameter(programs[name], gl.LINK_STATUS)) {
        console.error("PROGRAM ERROR:: " + gl.getProgramInfoLog(programs[name]));
        return;
    }
};
const getProgram = (name) => programs[name];
const initRenderer = (canvasId, width, height) => {
    const canvas = document.getElementById(canvasId);
    canvas.width = width;
    canvas.height = height;
    try {
        gl = canvas.getContext("webgl2");
    }
    catch (e) {
        throw e;
    }
    const vertexShaderSource = document.getElementById("basic.vert")?.textContent;
    const fragmentShaderSource = document.getElementById("basic.frag")?.textContent;
    createProgram(gl, "basic", vertexShaderSource, fragmentShaderSource);
};
const getContext = () => gl;
const setupWindowSize = () => {
    const main = document.getElementsByTagName("main")[0];
    const [W, H] = [innerWidth, innerHeight];
    let width = 0;
    let height = 0;
    if (W > H) {
        // leave window screen as
        width = W;
        height = H;
        main.setAttribute("style", `
            width: ${width}px;
            height: ${height}px;
        `);
    }
    else {
        // height is shorter than the width, use landscape
        // this is a rough attempt to detect mobile devices
        width = H;
        height = W;
        main.setAttribute("style", `
            width: ${width}px;
            height: ${height}px;
            transform-origin: 0px 0px;
            position: absolute;
            left: 100%;
            transform: rotate(90deg);
        `);
    }
    return { width, height };
};
const resetContext = (w, h) => {
    gl.canvas.width = w;
    gl.canvas.height = h;
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
};
const getWidth = () => gl.canvas.width;
const getHeight = () => gl.canvas.height;
export { initRenderer, getProgram, setupWindowSize, getContext, resetContext, setGameState, getGameState, getWidth, getHeight };
