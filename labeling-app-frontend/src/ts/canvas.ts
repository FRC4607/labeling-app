import { getPrimaryColor, getSecondaryColor } from "./colors";
import { disableNext, enableNext } from "./events";
import { getState } from "./state";

const canvasElement: HTMLCanvasElement = document.getElementById("img_canvas")! as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D = canvasElement.getContext("2d")!;

// do not change to let, it doesn't work
var placementEnabled: boolean = false;

interface Operation {
}

class SetImageOperation implements Operation {
    imgBlob: Blob;

    constructor(imgBlob: Blob) {
        this.imgBlob = imgBlob;
    }
}

class PlacePointOperation implements Operation {
    x: number;
    y: number;
    outerStyle: string;
    innerStyle: string;

    constructor(x: number, y: number, outerStyle: string, innerStyle: string) {
        this.x = x;
        this.y = y;
        this.outerStyle = outerStyle;
        this.innerStyle = innerStyle;
    }
}

class DrawBBOperation implements Operation {
    labelId: 0 | 1 | 2;

    x1: number;
    y1: number;
    x2: number;
    y2: number;
    outerStyle: string
    innerStyle: string

    constructor(labelId: 0 | 1 | 2, x1: number, y1: number, x2: number, y2: number, outerStyle: string, innerStyle: string) {
        this.labelId = labelId;
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.outerStyle = outerStyle;
        this.innerStyle = innerStyle;
    }
}

let operations: Operation[] = new Array<Operation>();

function _scaleRelativeX(x: number) {
    return x * ctx.canvas.width;
}

function _scaleRelativeY(y: number) {
    return y * ctx.canvas.height;
}

function setCanvasSize(w: number, h: number) {
    ctx.canvas.width = w;
    ctx.canvas.height = h;
    _redrawCanvas();
}

function clearCanvas() {
    const s = ctx.fillStyle;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = s;
}

async function setImage(img: SetImageOperation, addOp: boolean = true) {
    const imgBitmap = await createImageBitmap(img.imgBlob);
    ctx.drawImage(imgBitmap, 0, 0, ctx.canvas.width, ctx.canvas.height);
    if (addOp) {
        operations[0] = img;
    }
}

function placePoint(point: PlacePointOperation, addOp: boolean = true) {
    if (placementEnabled) {
        // Calculate the radius relative to canvas width, round
        const relRadius = +(ctx.canvas.width * 0.005);
        // Backups
        const s = ctx.strokeStyle;
        const f = ctx.strokeStyle;
        const l = ctx.lineWidth;
        // Draw the outer circle
        ctx.strokeStyle = point.outerStyle;
        ctx.lineWidth = +(relRadius * 0.125)
        ctx.beginPath();
        ctx.ellipse(_scaleRelativeX(point.x), _scaleRelativeY(point.y), relRadius, relRadius, 0, 0, 2 * Math.PI);
        ctx.stroke();
        // Draw the inner circle
        ctx.fillStyle = point.innerStyle;
        ctx.beginPath();
        const offsetRadius = relRadius - +(ctx.lineWidth / 2);
        ctx.ellipse(_scaleRelativeX(point.x), _scaleRelativeY(point.y), offsetRadius, offsetRadius, 0, 0, 2 * Math.PI);
        ctx.fill();
        // Restore
        ctx.strokeStyle = s;
        ctx.fillStyle = f;
        ctx.lineWidth = l;
        if (addOp) {
            operations.push(point);
            disableNext();
            // See if we need to draw a bounding box
            if (operations.length >= 5
                && operations[operations.length - 2] instanceof PlacePointOperation
                && operations[operations.length - 3] instanceof PlacePointOperation
                && operations[operations.length - 4] instanceof PlacePointOperation
            ) {
                drawBB(_calcECRect(operations.slice(operations.length - 4)));
            }
        }
    }
}

function drawBB(box: DrawBBOperation, addOp: boolean = true) {
    if (placementEnabled) {
        const relThickness = +(ctx.canvas.width * 0.005);
        // Backups
        const s = ctx.strokeStyle;
        const f = ctx.strokeStyle;
        const l = ctx.lineWidth;
        // Draw the outer box
        ctx.strokeStyle = box.outerStyle;
        ctx.lineWidth = +(relThickness * 0.125);
        const w = _scaleRelativeX(box.x2 - box.x1);
        const h = _scaleRelativeY(box.y2 - box.y1);
        ctx.beginPath();
        ctx.rect(_scaleRelativeX(box.x1), _scaleRelativeY(box.y1), w, h)
        ctx.stroke();
        // Draw the inner circle
        ctx.fillStyle = box.innerStyle;
        ctx.beginPath();
        const offsetThickness = +(ctx.lineWidth / 2);
        ctx.rect(_scaleRelativeX(box.x1) + offsetThickness, _scaleRelativeY(box.y1) + offsetThickness, w - offsetThickness, h - offsetThickness);
        ctx.fill();
        // Restore
        ctx.strokeStyle = s;
        ctx.fillStyle = f;
        ctx.lineWidth = l;
        if (addOp) {
            operations.push(box);
            enableNext();
        }
    }
}

async function _redrawCanvas() {
    clearCanvas();
    if (operations[0]) {
        await setImage(operations[0] as SetImageOperation, false);
    }
    operations.forEach(op => {
        if (op instanceof SetImageOperation) {
            
        } else if (op instanceof PlacePointOperation) {
            placePoint(op, false)
        } else if (op instanceof DrawBBOperation) {
            drawBB(op, false)
        } else {
            console.error("Invalid operation encountered in redraw.")
        }
    });
}

function removeLastOperation(redraw: boolean = true) {
    if (placementEnabled) {
        if(operations.length > 1) {
            const op = operations.pop();
            if (op instanceof DrawBBOperation) {
                if (op.labelId == getState()) {
                    removeLastOperation(false);
                }
                else {
                    operations.push(op);
                    return;
                }
            }
            if (redraw) {
                _redrawCanvas();
            }
        }
        if (operations[operations.length - 1 ] instanceof DrawBBOperation) {
            enableNext();
        }
        else {
            disableNext();
        }
    }
}

function getCanvasWidth() {
    return ctx.canvas.width;
}

function getCanvasHeight() {
    return ctx.canvas.height;
}

function _calcECRect(ops: Operation[]): DrawBBOperation {
    let x1 = Infinity;
    let y1 = Infinity;
    let x2 = 0;
    let y2 = 0;
    ops.forEach(op => {
        let cOp = op as PlacePointOperation;
        x1 = Math.min(x1, cOp.x);
        x2 = Math.max(x2, cOp.x);
        y1 = Math.min(y1, cOp.y);
        y2 = Math.max(y2, cOp.y);
    });
    return new DrawBBOperation(
        getState() as (0 | 1 | 2),
        x1,
        y1,
        x2,
        y2,
        getPrimaryColor(),
        getSecondaryColor()
    )
}

function enablePlacement() {
    placementEnabled = true;
}

function disablePlacement() {
    placementEnabled = false;
}

function getBoundingBoxes(): DrawBBOperation[] {
    return (operations.filter(e => {
        return e instanceof DrawBBOperation;
    }) as DrawBBOperation[]);
}

export {clearCanvas, setImage, placePoint, setCanvasSize, drawBB, removeLastOperation, getCanvasWidth, getCanvasHeight, SetImageOperation, PlacePointOperation, DrawBBOperation, enablePlacement, disablePlacement, getBoundingBoxes};