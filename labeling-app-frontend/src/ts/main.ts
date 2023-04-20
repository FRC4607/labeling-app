// Import our custom CSS
import '../scss/styles.scss';

// jQuery
import $ from 'jquery';

import { setCanvasSize, disablePlacement } from './canvas';
import { getJob } from './api';
import { disableNext } from './events';

disablePlacement();
disableNext();

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

getJob();