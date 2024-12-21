export default class Moveable {

    static speed: number = 0;

    constructor(
        public pos = {x: 0, y: 0, z: 0},
    ){}

    move() {
        this.pos.z += Moveable.speed;
    }
 
}