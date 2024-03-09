import { mineEntry } from "./types/mineEntry";

export class winmineBuilder {
    // x x x x
    //y
    //y
    //y
    private XXdirection: number[] = [-1, 0, 1, 1, 1, 0, -1, -1];
    private YYdirection: number[] = [-1, -1, -1, 0, 1, 1, 1, 0];
    private rank: number = 0.9;

    private board: mineEntry[][] = new Array<mineEntry[]>(0);
    private width: number = 0;
    private height: number = 0;

    constructor() {}

    public createWinmine(
        width: number,
        height: number,
        mineNum: number
    ): mineEntry[][] {
        this.width = width;
        this.height = height;

        if (this.width * this.height * this.rank <= mineNum) {
            console.log("mineNum too much");
            throw new Error("雷过多");
        }

        if (this.width <= 0 || this.height <= 0) {
            console.log("棋盘过小");
            throw new Error("棋盘过小");
        }

        this.createEntryBoard();
        this.fillMine(mineNum);
        this.countMineNumber();

        return this.board;
    }

    // 统计周围雷的数量
    private countMineNumber(): void {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.board[y][x] === mineEntry.mine) {
                    continue;
                }

                // test
                if (this.board[y][x] !== mineEntry.empty) {
                    console.log("方块出错");
                }

                switch (this.countMineInABoard(x, y)) {
                    case 0:
                        this.board[y][x] = mineEntry.empty;
                        break;
                    case 1:
                        this.board[y][x] = mineEntry.mine1;
                        break;
                    case 2:
                        this.board[y][x] = mineEntry.mine2;
                        break;
                    case 3:
                        this.board[y][x] = mineEntry.mine3;
                        break;
                    case 4:
                        this.board[y][x] = mineEntry.mine4;
                        break;
                    case 5:
                        this.board[y][x] = mineEntry.mine5;
                        break;
                    case 6:
                        this.board[y][x] = mineEntry.mine6;
                        break;
                    case 7:
                        this.board[y][x] = mineEntry.mine7;
                        break;
                    case 8:
                        this.board[y][x] = mineEntry.mine8;
                        break;
                    default:
                        throw new Error("不应该出现其他方块");
                }
            }
        }
    }

    private countMineInABoard(x: number, y: number): number {
        let count = 0;
        for (let i = 0; i < this.XXdirection.length; i++) {
            const xx = x + this.XXdirection[i];
            const yy = y + this.YYdirection[i];
            if (this.outOfBoard(xx, yy)) {
                continue;
            }

            if (this.board[yy][xx] === mineEntry.mine) {
                count++;
            }
        }

        // test
        if (count > 8) {
            console.log("统计雷数量过多");
            throw new Error("统计雷数量过多");
        }

        return count;
    }

    // 往board中填充 雷
    private fillMine(mineNum: number): void {
        for (let i = 0; i < mineNum; ) {
            const randomXX: number = this.createRandomNum(0, this.width);
            const randomYY: number = this.createRandomNum(0, this.height);

            if (this.board[randomYY][randomXX] === mineEntry.mine) {
                continue;
            }

            this.board[randomYY][randomXX] = mineEntry.mine;
            i++;
        }
    }

    // create a new empty board
    private createEntryBoard(): void {
        this.board = new Array(this.height)
            .fill(0)
            .map(() => new Array(this.width).fill(mineEntry.empty));
    }

    private outOfBoard(x: number, y: number): boolean {
        if (x < 0 || x >= this.width) {
            return true;
        }

        return y < 0 || y >= this.height;
    }

    // create a random number in range [min, max), and number is Integer
    private createRandomNum(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min) + min);
    }
}
