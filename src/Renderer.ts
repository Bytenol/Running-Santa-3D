let gl: WebGL2RenderingContext;
const programs: {[key:string]: WebGLProgram } = {};

const createShader = (gl: WebGL2RenderingContext, type: GLenum, src: string) => {
    const shader = gl.createShader(type) as WebGLShader;
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error((type === gl.VERTEX_SHADER ? "VERTEX_SHADER" : "FRAGMENT_SHADER") +
            `::${gl.getShaderInfoLog(shader)}`);
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}


const createProgram = (gl: WebGL2RenderingContext, name: string, vSource: string, fSource: string) => {
    const vShader = createShader(gl, gl.VERTEX_SHADER, vSource) as WebGLShader;
    const fShader = createShader(gl, gl.FRAGMENT_SHADER, fSource) as WebGLShader;
    programs[name] = gl.createProgram() as WebGLProgram;
    gl.attachShader(programs[name], vShader);
    gl.attachShader(programs[name], fShader);
    gl.linkProgram(programs[name]);
    if (!gl.getProgramParameter(programs[name], gl.LINK_STATUS)) {
        console.error("PROGRAM ERROR:: " + gl.getProgramInfoLog(programs[name]));
        return;
    }
}


const getProgram = (name: string) => programs[name];


export default class Renderer {

    static width = 640;

    static height = 360;

    static init(canvasId: string) {
        const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        canvas.width = Renderer.width;
        canvas.height = Renderer.height;

        try {
            gl = canvas.getContext("webgl2") as WebGL2RenderingContext;
        } catch (e: any) {
            throw e;
        }

        const vertexShaderSource = document.getElementById("basic.vert")?.textContent as string;
        const fragmentShaderSource = document.getElementById("basic.frag")?.textContent as string;
        createProgram(gl, "basic", vertexShaderSource, fragmentShaderSource);
    }

    static getContext(): WebGL2RenderingContext {
        return gl;
    }

    static draw(gl: WebGL2RenderingContext) {

    }

    static update(gl: WebGL2RenderingContext, dt: number) {

    }


}

const forceLandscape = () => {
    const main = document.getElementsByTagName("main")[0];
    const [W, H] = [innerWidth, innerHeight];
    const aspectRatio = 640 / 360;
    if(W > H) {
        main.style.width = W + "px";
        main.style.height = H + "px";
    } else {
        main.style.width = H + "px";
        main.style.height = W + "px";
    }
}


export {
    getProgram,
    forceLandscape
}