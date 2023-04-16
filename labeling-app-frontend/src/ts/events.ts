import $ from 'jquery';
import { PlacePointOperation, placePoint, getCanvasWidth, getCanvasHeight, removeLastOperation } from './canvas';
import Mousetrap from 'mousetrap';
import { nextState } from './state';
import { getPrimaryColor, getSecondaryColor } from './colors';

$("#img_canvas").on("click", (e) => {
    const op = new PlacePointOperation(
        e.offsetX / getCanvasWidth(),
        e.offsetY / getCanvasHeight(),
        getPrimaryColor(), getSecondaryColor()
    );
    placePoint(op);
});

const undo = () => {
    removeLastOperation();
};

$("#undo-btn").on("click", undo);

Mousetrap.bind("ctrl+z", undo);

let progressEnabled = false;

function disableNext() {
    $("#progress-btn").prop("disabled", true);
    progressEnabled = false;
}

function enableNext() {
    $("#progress-btn").prop("disabled", false);
    progressEnabled = true;
}

const moveToNextState = () => {
    if (progressEnabled) {
        nextState();
    }
};

$("#progress-btn").on("click", moveToNextState);

Mousetrap.bind("enter", moveToNextState);

export {disableNext, enableNext};