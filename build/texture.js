import { getImage } from "./Loader.js";
let textureLocation;
class Texture {
    gl;
    image;
    texture;
    unit;
    unitIndex;
    constructor(gl, image) {
        this.gl = gl;
        this.image = image;
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
    static _unit = 0;
    static allTextures = {};
}
const setupTextureLocation = (loc) => {
    textureLocation = loc;
};
const createTextureFromImage = (gl, name) => {
    const img = getImage(name);
    Texture.allTextures[name] = new Texture(gl, img);
};
const getTexture = (name) => Texture.allTextures[name];
const setTexture = (name) => {
    const texture = getTexture(name);
    texture.bind();
};
export { setupTextureLocation, createTextureFromImage, getTexture, setTexture };
