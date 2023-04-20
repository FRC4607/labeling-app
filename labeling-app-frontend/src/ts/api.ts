import { clearCanvas, clearOps, DrawBBOperation, getBoundingBoxes, setImage, SetImageOperation } from "./canvas";
import { nextState } from "./state";

import $ from "jquery";

class LabelSubmission {
    imgId: string;
    labels: number[][][];
    submitter: string;

    constructor(imgId: string, labels: number[][][], submitter: string) {
        this.imgId = imgId;
        this.labels = labels;
        this.submitter = submitter;
    }
}

interface TaskResponse {
    imgId: string;
    data: string;
}

var currentImgId: string;

function computeYOLOBB(box: DrawBBOperation): number[] {
    const x = (box.x1 + box.x2) / 2;
    const y = (box.y1 + box.y2) / 2;
    const w = Math.abs(box.x2 - box.x1);
    const h = Math.abs(box.y2 - box.y1);
    return [x, y, w, h];
}

async function getJob() {
    // TODO: Add the actual API endpoint
    const b: TaskResponse = await (await fetch("/api/getTask")).json()
    currentImgId = b.imgId;
    const op = new SetImageOperation(await (await fetch(b.data)).blob());
    clearOps();
    clearCanvas();
    setImage(op);
    nextState();
}

async function sendServerPost() {
    const labels: number[][][] = new Array<number[][]>();
    labels[0] = new Array<number[]>();
    labels[1] = new Array<number[]>();
    labels[2] = new Array<number[]>();
    getBoundingBoxes().forEach(e => {
        labels[e.labelId].push(computeYOLOBB(e))
    });
    const data = new LabelSubmission(currentImgId, labels, $("#name-box").val() as string);
    // TODO: Add thhe actual API endpoint
    await fetch("/api/submitLabels", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    })
    nextState();
}
export {getJob, sendServerPost}