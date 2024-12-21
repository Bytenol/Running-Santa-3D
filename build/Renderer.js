let gl;
const programs = {};
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
export default class Renderer {
    static width = 640;
    static height = 360;
    static init(canvasId) {
        const canvas = document.getElementById(canvasId);
        canvas.width = Renderer.width;
        canvas.height = Renderer.height;
        try {
            gl = canvas.getContext("webgl2");
        }
        catch (e) {
            throw e;
        }
        const vertexShaderSource = document.getElementById("basic.vert")?.textContent;
        const fragmentShaderSource = document.getElementById("basic.frag")?.textContent;
        createProgram(gl, "basic", vertexShaderSource, fragmentShaderSource);
    }
    static getContext() {
        return gl;
    }
    static draw(gl) {
    }
    static update(gl, dt) {
    }
}
const forceLandscape = () => {
    const main = document.getElementsByTagName("main")[0];
    const [W, H] = [innerWidth, innerHeight];
    const aspectRatio = 640 / 360;
    if (W > H) {
        main.style.width = W + "px";
        main.style.height = H + "px";
    }
    else {
        main.style.width = H + "px";
        main.style.height = W + "px";
    }
};
export { getProgram, forceLandscape };
