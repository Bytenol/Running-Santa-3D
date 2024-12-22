import { getGameState, getHeight, getWidth, resetContext, setupWindowSize } from "./Renderer";
class ImageRectBoundEvent {
    name;
    x;
    y;
    w;
    h;
    func;
    constructor(name, x, y, w, h, func) {
        this.name = name;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.func = func;
        window.addEventListener("click", (e) => {
            if (e.clientX >= x && e.clientX <= (x + w) && e.clientY >= y && e.clientY <= (y + h))
                func(e);
        });
    }
}
const onWindowResize = () => {
    const { width, height } = setupWindowSize();
    resetContext(width, height);
};
const onMenuClick = (e) => {
    if (getGameState() !== 0 /* GameState.MENU */)
        return;
    const sy = getHeight() * 0.26;
    const sh = getHeight() * 0.5;
    const bh = sh / 4;
    const cy = Math.floor((e.clientY - sy) / bh);
    switch (cy) {
        case 0:
            console.log("Play game");
            break;
        case 1:
            break;
        case 2:
            console.log("Help");
            break;
        case 3:
            console.log("about");
    }
};
const initEvent = () => {
    window.addEventListener("resize", onWindowResize);
    new ImageRectBoundEvent("menu", getWidth() * 0.52, getHeight() * 0.26, getWidth() * 0.25, getHeight() * 0.5, onMenuClick);
};
export default initEvent;
