import { DrawBBOperation, getBoundingBoxes } from "./canvas";

class LabelSubmission {
    imgId: string;
    labels: number[][][];

    constructor(imgId: string, labels: number[][][]) {
        this.imgId = imgId;
        this.labels = labels;
    }
}

function computeYOLOBB(box: DrawBBOperation): number[] {
    const x = (box.x1 + box.x2) / 2;
    const y = (box.y1 + box.y2) / 2;
    const w = Math.abs(box.x2 - box.x1);
    const h = Math.abs(box.y2 - box.y1);
    return [x, y, w, h];
}

function sendServerPost() {
    const labels: number[][][] = new Array<number[][]>();
    labels[0] = new Array<number[]>();
    labels[1] = new Array<number[]>();
    labels[2] = new Array<number[]>();
    getBoundingBoxes().forEach(e => {
        labels[e.labelId].push(computeYOLOBB(e))
    });
    console.log(labels);
}
export {sendServerPost}