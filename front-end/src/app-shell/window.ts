console.log("Loading another file.");

export default class {
    data: any[];

    constructor() {
        this.data = [1, 2, 3];
    }

    public lastItem() {
        return this.data[this.data.length - 1];
    }

    public async Test() {
        return 1;
    }
};

