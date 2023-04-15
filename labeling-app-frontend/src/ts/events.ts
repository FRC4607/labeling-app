import $ from 'jquery';
import { PlacePointOperation, placePoint, getCanvasWidth, getCanvasHeight, removeLastOperation } from './canvas';
import Mousetrap from 'mousetrap';

$("#img_canvas").on("click", (e) => {
    const op = new PlacePointOperation(
        e.offsetX / getCanvasWidth(),
        e.offsetY / getCanvasHeight(),
        "red", "yellow"
    );
    placePoint(op);
});

const undo = () => {
    removeLastOperation();
};

$("#undo-btn").on("click", undo);

Mousetrap.bind("ctrl+z", undo);

export {}