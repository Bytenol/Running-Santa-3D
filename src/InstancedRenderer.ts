export default class InstancedRenderer {

    private vao: WebGLVertexArrayObject;
    private buffer: WebGLBuffer;
    private instancedData: number[];
    private instancedBuffer: WebGLBuffer;

    constructor(private gl: WebGL2RenderingContext, public bufferData: number[], size: number) {
        this.vao = this.gl.createVertexArray();
        this.gl.bindVertexArray(this.vao);
        this.buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
        if(bufferData.length == 0)
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(72*Float32Array.BYTES_PER_ELEMENT), this.gl.STATIC_DRAW);
        else {
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(bufferData), this.gl.STATIC_DRAW);
        }    
        this.gl.enableVertexAttribArray(0);
        this.gl.vertexAttribPointer(0, 3, this.gl.FLOAT, false, 8 * Float32Array.BYTES_PER_ELEMENT, 0);
        this.gl.enableVertexAttribArray(1);
        this.gl.vertexAttribPointer(1, 2, this.gl.FLOAT, false, 8 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
        this.gl.enableVertexAttribArray(2);
        this.gl.vertexAttribPointer(2, 3, this.gl.FLOAT, false, 8 * Float32Array.BYTES_PER_ELEMENT, 5 * Float32Array.BYTES_PER_ELEMENT);

        this.instancedBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.instancedBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(size), gl.DYNAMIC_DRAW);
        this.gl.vertexAttribPointer(3, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(3);
        this.gl.vertexAttribDivisor(3, 1);
        this.instancedData = [];
    }

    setBufferData(data: number[]) {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
        this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, new Float32Array(data));
    }

    setInstancedData(data: number[]) {
        this.instancedData = [...data];
    }

    get drawLength() {
        return this.instancedData.length / 3;
    }

    render() {
        this.gl.bindVertexArray(this.vao);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.instancedBuffer);
        this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, new Float32Array(this.instancedData));
        this.gl.drawArraysInstanced(this.gl.TRIANGLES, 0, this.bufferData.length / 3, this.drawLength);
    }

}