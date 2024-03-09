import {mineEntry} from "./types/mineEntry";
import {winmineBuilder} from "./winmineBuilder";
import {Grid} from "./class";

export class gameMinesweeper {
    private xxDirection = [-1, 0, 1, 1, 1, 0, -1, -1];
    private yyDirection = [-1, -1, -1, 0, 1, 1, 1, 0];

    private mineBuilder: winmineBuilder = new winmineBuilder();

    private expectBoard: mineEntry[][] = [];
    private actualBoard: mineEntry[][] = [];
    private width: number = 0;
    private height: number = 0;
    private _mineNum: number = 0;
    private leftBlock: number = 0;
    private isDead: boolean = true;

    private flagBoard: boolean[][] = new Array(0);
    private needHandleGrid: Array<Grid> = [];
    private _dead: () => void = (): void => {
    };
    private _win: () => void = (): void => {
    };

    public initGame(
        width: number,
        height: number,
        mineNum: number
    ): mineEntry[][] {
        this.expectBoard = this.mineBuilder.createWinmine(
            width,
            height,
            mineNum
        );
        this.actualBoard = new Array(height)
            .fill(0)
            .map(() => new Array(width).fill(mineEntry.block));
        this.isDead = false;
        this.width = width;
        this.height = height;
        this._mineNum = mineNum;
        this.leftBlock = width * height - mineNum;
        // this._dead = () => {};
        this._win = () => {
        };

        return this.actualBoard;
    }

    public leftClick(x: number, y: number): Array<Grid> {
        this.needHandleGrid = [];

        if (this.isDead) {
            console.log("已经结束了");
            return [];
        }

        if (this.actualBoard[y][x] == mineEntry.flag) {
            return [];
        }

        if (this.actualBoard[y][x] !== mineEntry.block) {
            return [];
        }


        if (this.expectBoard[y][x] == mineEntry.mine) {
            this.isDead = true;
            this.actualBoard[y][x] = mineEntry.onMine;
            this.needHandleGrid.push(new Grid(x, y));
            this._dead();
        } else if (this.expectBoard[y][x] !== mineEntry.empty) {
            this.actualBoard[y][x] = this.expectBoard[y][x];
            this.needHandleGrid.push(new Grid(x, y));
        } else {
            // 用于广度优先的标记
            this.flagBoard = new Array(this.height)
                .fill(false)
                .map(() => new Array(this.width).fill(false));

            this.bfs(x, y);
            this.syncMineNumForBFS();
        }

        this.leftBlock -= this.needHandleGrid.length;
        if (this.leftBlock === 0) {
            this._win();
        }

        return this.needHandleGrid;
    }

    public rightClick(x: number, y: number): Array<Grid> {
        this.needHandleGrid = [];

        if (this.isDead) {
            console.log("已经结束了");
            return [];
        }

        if (
            this.actualBoard[y][x] !== mineEntry.flag &&
            this.actualBoard[y][x] !== mineEntry.block
        ) {
            return [];
        }

        if (this.actualBoard[y][x] === mineEntry.flag) {
            this.actualBoard[y][x] = mineEntry.block;
            this._mineNum++;
        } else if (
            this.actualBoard[y][x] === mineEntry.block &&
            this.mineNum > 0
        ) {
            this.actualBoard[y][x] = mineEntry.flag;
            this._mineNum--;
        }

        this.needHandleGrid.push(new Grid(x, y));
        return this.needHandleGrid;
    }

    private bfs(x: number, y: number): void {
        const queue: Array<Grid> = [];
        queue.push(new Grid(x, y));

        while (queue.length != 0) {
            // @ts-ignore
            const grid: Grid = queue.shift();

            for (let i: number = 0; i < this.xxDirection.length; i++) {
                const xx: number = grid.x + this.xxDirection[i];
                const yy: number = grid.y + this.yyDirection[i];

                // 越界 已经标记
                if (this.outOfBoard(xx, yy) || this.flagBoard[yy][xx]) {
                    continue;
                }
                // 已经点击过
                if (this.actualBoard[yy][xx] !== mineEntry.block) {
                    continue;
                }

                this.flagBoard[yy][xx] = true;
                this.needHandleGrid.push(new Grid(xx, yy));
                // 不为空格 则不进一步拓展
                if (this.expectBoard[yy][xx] !== mineEntry.empty) {
                    continue;
                }

                queue.push(new Grid(xx, yy));
            }
        }
    }

    private syncMineNumForBFS() {
        this.needHandleGrid.forEach((value) => {
            if (this.actualBoard[value.y][value.x] === mineEntry.flag) {
                this._mineNum++;
            }

            this.actualBoard[value.y][value.x] =
                this.expectBoard[value.y][value.x];
        });
    }

    private outOfBoard(x: number, y: number): boolean {
        if (x < 0 || x >= this.width) {
            return true;
        }

        return y < 0 || y >= this.height;
    }

    public dead(value: () => void) {
        this._dead = value;
    }

    public win(value: () => void) {
        this._win = value;
    }

    get mineNum() {
        return this._mineNum;
    }
}
