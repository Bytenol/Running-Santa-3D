export default class Moveable {
    pos;
    static speed = 0;
    constructor(pos = { x: 0, y: 0, z: 0 }) {
        this.pos = pos;
    }
    move() {
        this.pos.z += Moveable.speed;
    }
}
