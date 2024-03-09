export class Grid {
    private readonly _x: number;
    private readonly _y: number;
    constructor(x: number, y: number) {
        this._x = x;
        this._y = y;
    }

    get x(): number {
        return this._x;
    }

    get y(): number {
        return this._y;
    }
}

export class GameSubject {
    time: number;
    timer: NodeJS.Timeout | null;

    constructor() {
        this.time = 0;
        this.timer = null;
    }

    public start(execute: Function, delay: number) {
        this.end();

        this.time = 1;
        this.timer = setInterval(() => {
            execute(this.time++);
        }, delay);
    }

    public end() {
        if (this.timer) {
            clearInterval(this.timer);
            this.time = 0;
        }
    }
}
