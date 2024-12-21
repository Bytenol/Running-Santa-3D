import { getImage } from "./Loader.js";

let textureLocation: WebGLUniformLocation;


class Texture {

    private texture: WebGLBuffer;
    private unit: number;
    private unitIndex: number;

    constructor(private gl: WebGL2RenderingContext, private image: HTMLImageElement) {
        this.texture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.image);        
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.bindTexture(gl.TEXTURE_2D, null);
        this.unitIndex = Texture._unit++;
        this.unit = gl.TEXTURE0 + this.unitIndex;
    }

    bind() {
        const gl = this.gl;
        gl.activeTexture(this.unit);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.uniform1i(textureLocation, this.unitIndex);
    }

    private static _unit = 0;

    static allTextures: {[key:string]: Texture} = {};

}

const setupTextureLocation = (loc: WebGLUniformLocation) => {
    textureLocation = loc;
}


const createTextureFromImage = (gl:WebGL2RenderingContext, name: string) => {
    const img = getImage(name) as HTMLImageElement;
    Texture.allTextures[name] = new Texture(gl, img);
}


const getTexture = (name: string) => Texture.allTextures[name] as Texture;


const setTexture = (name: string) => {
    const texture = getTexture(name);
    texture.bind();
}


export {
    setupTextureLocation,
    createTextureFromImage,
    getTexture,
    setTexture
}