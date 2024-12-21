const images: { [key: string]: any } = {};


const audioLoader = (hostname: string, info: iAssetInfo) => {
    return Promise.resolve(1);
}


const imageLoader = (hostname: string, info: iAssetInfo) => {
    const image = new Image();
    image.src = hostname + info.url;
    const res = new Promise((resolve, reject) => {
        image.addEventListener("load", e => {
            images[info.name] = image;
            resolve(e);
        });
        image.addEventListener("error", e => {
            reject(e);
        });
    });
    return res;
}


const loadAssets = async (hostname: string, assetInfo: iAssetInfo[]) => {
    const promises = []
    for (let assets of assetInfo)
        promises.push(assets.type === "image" ? imageLoader(hostname, assets) : audioLoader(hostname, assets));
    return await Promise.all(promises);
}


const getImage = (name: string): HTMLImageElement | undefined => images[name];


export {
    loadAssets,
    getImage
}