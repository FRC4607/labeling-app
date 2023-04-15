const dirElement: HTMLHeadingElement = document.getElementById("direction_text")! as HTMLHeadingElement;

function setWaitingImg() {
    dirElement.innerHTML = "Waiting for next image...";
}

function setCube() {
    dirElement.innerHTML = "Label the <span style=\"color: purple\">CUBES</span>";
}

function setUprightCone() {
    dirElement.innerHTML = "Label the <span style=\"color: yellow\">UPRIGHT CONES</span>";
}

function setTippedCone() {
    dirElement.innerHTML = "Label the <span style=\"color: red\">TIPPED</span> <span style=\"color: yellow\">CONES</span>";
}

function setWaitingForm() {
    dirElement.innerHTML = "Submitting labels...";
}

export {setWaitingImg, setCube, setUprightCone, setTippedCone, setWaitingForm}