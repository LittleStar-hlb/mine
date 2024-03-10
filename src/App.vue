<script setup lang="ts">
import { onMounted, onUnmounted, ref, Ref } from "vue";
import { mineEntry } from "./types/mineEntry";
import { gameMinesweeper } from "./gameMinesweeper";
import { Grid, GameSubject } from "./class";
import { link2Image, num2Entry, list } from "./assets/images";

const LayoutRef = ref<HTMLCanvasElement | null>(null);
const MineRef = ref<HTMLCanvasElement | null>(null);
const TimeRef = ref<HTMLCanvasElement | null>(null);
const ResetRef = ref<HTMLCanvasElement | null>(null);
const containerRef = ref<HTMLDivElement | null>(null);

const offsetX = 25;
const offsetY = 25;
const countOffsetX = 13;
const countOffsetY = 23;
const resetOffsetX = 21;
const resetOffsetY = 21;

const rowValue = ref(10);
const colValue = ref(10);
const mineValue = ref(1);

const progressLen = ref(0);
const firstClick = ref(true);
// const gameStste = Object.freeze({
//     init: 0,
//     start: 1,
//     end: 2,
// });

let gameSubject: GameSubject = new GameSubject();
let minesweeper: gameMinesweeper = new gameMinesweeper();
let mineeee: mineEntry[][] = new Array();

minesweeper.dead(() => {
    if (!LayoutRef.value) return;
    LayoutRef.value.style.pointerEvents = "none";
    gameSubject.end();
    drawReset(1);
});

minesweeper.win(() => {
    if (!LayoutRef.value) return;
    LayoutRef.value.style.pointerEvents = "none";
    gameSubject.end();
    drawReset(0);
});

const resetGame = () => {
    if (!LayoutRef.value) return;
    LayoutRef.value.style.pointerEvents = "auto";
    gameSubject.end();
    firstClick.value = true;
    initView();
};

const leftClickHandler = (event: MouseEvent) => {
    if (firstClick.value) {
        firstClick.value = false;
        gameSubject.start((time: number) => {
            drawImageOnTimeOrMine(time, TimeRef);
        }, 1000);
    }
    mouseEventHandler("left", event);
};

const rightClickHandler = (event: MouseEvent) => {
    mouseEventHandler("right", event);
};

const submitClickHandler = () => {
    if (!rowValue.value && !colValue.value && !mineValue.value) return;

    resetGame();
};

function mouseEventHandler(type: string, event: MouseEvent) {
    const x: number = Math.floor(event.offsetX / offsetX);
    const y: number = Math.floor(event.offsetY / offsetY);
    let needHandleGrid: Array<Grid> = new Array();

    switch (type) {
        case "left":
            needHandleGrid = minesweeper.leftClick(x, y);
            break;
        case "right":
            needHandleGrid = minesweeper.rightClick(x, y);
            break;
    }

    for (const grid of needHandleGrid) {
        drawImageOnBlock(grid.x, grid.y);
    }

    drawImageOnTimeOrMine(minesweeper.mineNum, MineRef);
}

function drawImageOnBlock(x: number, y: number) {
    if (!LayoutRef.value) return;

    const context = LayoutRef.value.getContext("2d");
    const image = link2Image.get(mineeee[y][x]) || new Image();

    if (context) {
        context.clearRect(x * offsetX, y * offsetY, 25, 25);
        context.drawImage(image, x * offsetX, y * offsetY);
    }
}

function drawImageOnTimeOrMine(
    num: number,
    HtmlRef: Ref<HTMLCanvasElement | null>
) {
    if (!HtmlRef.value) return;

    const context = HtmlRef.value.getContext("2d");
    const n: Array<string> = num.toString().padStart(3, "0").split("");

    if (context) {
        HtmlRef.value.width = countOffsetX * n.length;
        HtmlRef.value.height = countOffsetY;
        context.clearRect(0, 0, HtmlRef.value.width, HtmlRef.value.height);
        for (let i = 0; i < n.length; i++) {
            const image =
                link2Image.get(num2Entry.get(parseInt(n[i])) || 0) ||
                new Image();

            context.drawImage(image, i * countOffsetX, 0 * countOffsetY);
        }
    }
}

function drawGridAndBlocks(rowLen: number, colLen: number) {
    if (!LayoutRef.value || !TimeRef.value || !MineRef.value || !ResetRef.value)
        return;

    LayoutRef.value.width = rowLen * offsetX;
    LayoutRef.value.height = colLen * offsetY;
    ResetRef.value.width = resetOffsetX;
    ResetRef.value.height = resetOffsetY;

    drawImageOnTimeOrMine(minesweeper.mineNum, MineRef);
    drawImageOnTimeOrMine(gameSubject.time, TimeRef);
    drawReset(15);
}

function drawReset(mapkey: number) {
    if (!ResetRef.value) return;

    const context = ResetRef.value.getContext("2d");
    const image = link2Image.get(mapkey) || new Image();

    if (context) {
        context.clearRect(0, 0, 21, 21);
        context.drawImage(image, 0, 0, 21, 21);
    }
}

function initView() {
    let rowLen = rowValue.value;
    let colLen = colValue.value;

    mineeee = minesweeper.initGame(
        rowValue.value,
        colValue.value,
        mineValue.value
    );
    drawGridAndBlocks(rowLen, colLen);

    for (let y = 0; y < colLen; y++) {
        for (let x = 0; x < rowLen; x++) {
            drawImageOnBlock(x, y);
        }
    }
}

function initProgress() {
    let num = 1;
    let len = list.length;
    const promises: Promise<any>[] = list.map((promise) => {
        return promise.then(() => {
            let result = `${(num++ / len) * 100}`;
            progressLen.value = parseInt(result);
        });
    });

    Promise.all(promises).then(() => {
        if (!containerRef.value) return;
        containerRef.value.style.pointerEvents = "auto";
        initView();
    });
}

onMounted(() => {
    initView();
    initProgress();
});

onUnmounted(() => {
    gameSubject.end();
    firstClick.value = false;
});
</script>

<template>
    <div ref="containerRef" class="container">
        <form class="title" @submit.prevent="submitClickHandler">
            <label for="row"
                >宽<input v-model.number="rowValue" type="text" id="row"
            /></label>
            <label for="col"
                >高<input v-model.number="colValue" type="text" id="col"
            /></label>
            <label for="mine"
                >雷<input v-model.number="mineValue" type="text" id="mine"
            /></label>
            <button type="submit" @keydown.prevent="submitClickHandler">
                确定
            </button>
        </form>
        <div class="frame">
            <header>
                <div><canvas ref="MineRef" class="time"></canvas></div>
                <div @click.prevent="resetGame">
                    <canvas ref="ResetRef"></canvas>
                </div>
                <div><canvas ref="TimeRef" class="time"></canvas></div>
            </header>
            <main>
                <div class="progressBar" v-if="progressLen !== 100">
                    <div class="progress"></div>
                </div>
                <canvas
                    ref="LayoutRef"
                    @click.prevent="leftClickHandler"
                    @contextmenu.prevent="rightClickHandler"
                ></canvas>
            </main>
        </div>
    </div>
</template>

<style scoped>
.title {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
    height: 45px;
    user-select: none;
}

.title label {
    display: flex;
    flex-direction: column;
    text-align: center;
    margin: 0 10px;
    font-size: 16px;
}

.title label input {
    text-align: center;
    vertical-align: middle;
    width: 50px;
    border-color: #fff;
}

.title button {
    flex-shrink: 0;
    height: calc(100% - 10px);
    border-color: #fff;
    border-width: 2px;
}

.frame {
    display: inline-block;
    padding: 10px;
    background-color: rgba(204, 204, 204);
    border-radius: 5px;
}

header {
    margin-bottom: 5px;
    padding: 2px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 2px solid #808080;
    border-right-color: #fff;
    border-bottom-color: #fff;
    user-select: none;
}

header > div {
    font-size: 17px;
}

header > div:nth-child(2) {
    width: 21px;
    height: 21px;
    border: 2px solid #808080;
    border-left-color: #fff;
    border-top-color: #fff;
}

header > div:nth-child(2):active {
    width: 21px;
    height: 21px;
    border: 2px solid #808080;
    transform: scale(0.9);
}

.time {
    pointer-events: none;
    vertical-align: bottom;
}

main {
    position: relative;
    display: flex;
    border: 2px solid #808080;
    border-right-color: #fff;
    border-bottom-color: #fff;
}

.progressBar {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 50%;
    height: 5px;
    transform: translate(-50%, -50%);
    background-color: rgba(80, 80, 80, 0.55);
    border-radius: 5px;
}

.progress {
    width: v-bind(progressLen + "%");
    height: 100%;
    background-color: rgba(0, 219, 146, 0.729);
    filter: blur(2px);
}
</style>
