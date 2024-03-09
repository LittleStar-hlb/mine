import { mineEntry } from "../types/mineEntry";

export const entry2link: Map<mineEntry, string> = new Map([
    [mineEntry.smile, "/src/assets/笑.png"],
    [mineEntry.flag, "/src/assets/旗帜.png"],
    [mineEntry.block, "/src/assets/方块.png"],
    [mineEntry.empty, "/src/assets/空格.png"],
    [mineEntry.mine, "/src/assets/雷.png"],
    [mineEntry.mine1, "/src/assets/雷1.png"],
    [mineEntry.mine2, "/src/assets/雷2.png"],
    [mineEntry.mine3, "/src/assets/雷3.png"],
    [mineEntry.mine4, "/src/assets/雷4.png"],
    [mineEntry.mine5, "/src/assets/雷5.png"],
    [mineEntry.mine6, "/src/assets/雷6.png"],
    [mineEntry.mine7, "/src/assets/雷7.png"],
    [mineEntry.mine8, "/src/assets/雷8.png"],
    [mineEntry.time0, "/src/assets/计时0.png"],
    [mineEntry.time1, "/src/assets/计时1.png"],
    [mineEntry.time2, "/src/assets/计时2.png"],
    [mineEntry.time3, "/src/assets/计时3.png"],
    [mineEntry.time4, "/src/assets/计时4.png"],
    [mineEntry.time5, "/src/assets/计时5.png"],
    [mineEntry.time6, "/src/assets/计时6.png"],
    [mineEntry.time7, "/src/assets/计时7.png"],
    [mineEntry.time8, "/src/assets/计时8.png"],
    [mineEntry.time9, "/src/assets/计时9.png"],
    [mineEntry.onMine, "/src/assets/炸雷.png"],
    [mineEntry.sad, "/src/assets/难过.png"],
    [mineEntry.win, "/src/assets/赢.png"],
]);

export const link2Image: Map<mineEntry, HTMLImageElement> = new Map();
export const list: Array<Promise<HTMLImageElement>> = new Array();
for (const [key, value] of entry2link) {
    const image = new Image();
    image.src = value;
    link2Image.set(key, image);

    const promise = new Promise<HTMLImageElement>((resolve, reject) => {
        image.onload = () => {
            resolve(image);
        };
        image.onerror = () => {
            reject(image);
        };
    });
    list.push(promise);
}

export const num2Entry: Map<number, mineEntry> = new Map([
    [0, mineEntry.time0],
    [1, mineEntry.time1],
    [2, mineEntry.time2],
    [3, mineEntry.time3],
    [4, mineEntry.time4],
    [5, mineEntry.time5],
    [6, mineEntry.time6],
    [7, mineEntry.time7],
    [8, mineEntry.time8],
    [9, mineEntry.time9],
]);
