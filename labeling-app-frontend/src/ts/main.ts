// Import our custom CSS
import '../scss/styles.scss';

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap';
bootstrap;

// jQuery
import $ from 'jquery';

import { clearCanvas, setImage, SetImageOperation, setCanvasSize } from './canvas';
import "./events";
import { nextState } from './state';
import { enableNext } from './events';

const the = await fetch("/yett.jpg");
const op1 = new SetImageOperation(
    await the.blob()
);

clearCanvas();
setImage(op1).then(() => {
    nextState();
    enableNext();
});

$(window).on("resize", async () => {
    // const canvas: HTMLCanvasElement = document.getElementById("img_canvas") as HTMLCanvasElement;
    // const ctx: CanvasRenderingContext2D  = canvas.getContext("2d")!;
    // ctx.canvas.height.
    const parentWidth = $("#img_canvas").parent().width()!;
    $("#img_canvas").width(parentWidth);
    $("#img_canvas").height(parentWidth * (2160 / 3840));
    setCanvasSize(parentWidth, parentWidth * (2160 / 3840));
});
$(window).trigger("resize");