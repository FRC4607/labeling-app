import { sendServerPost } from "./api";
import { disablePlacement, enablePlacement } from "./canvas";
import { setCube, setTippedCone, setUprightCone, setWaitingForm, setWaitingImg } from "./direction_text";
import { disableNext } from "./events";

enum ProgramState {
    CUBES,
    UPRIGHT_CONES,
    TIPPED_CONES,
    LOADING_IMG,
    SUBMIT_FORM
};

let state = ProgramState.LOADING_IMG;
setWaitingImg();
disablePlacement();

function getState(): ProgramState {
    return state;
}

function nextState() {
    disableNext();
    switch (state) {
        case ProgramState.LOADING_IMG:
            state = ProgramState.CUBES;
            setCube();
            enablePlacement();
            break;
        case ProgramState.CUBES:
            state = ProgramState.UPRIGHT_CONES;
            setUprightCone();
            break;
        case ProgramState.UPRIGHT_CONES:
            state = ProgramState.TIPPED_CONES;
            setTippedCone();
            break;
        case ProgramState.TIPPED_CONES:
            state = ProgramState.SUBMIT_FORM;
            setWaitingForm();
            disablePlacement();
            sendServerPost();
            break;
        case ProgramState.SUBMIT_FORM:
            state = ProgramState.LOADING_IMG;
            setWaitingImg();
            break;
    }
}

export { getState, nextState, ProgramState };