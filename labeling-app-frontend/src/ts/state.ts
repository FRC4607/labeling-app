import { setCube, setWaitingImg } from "./direction_text";

enum ProgramState {
    LOADING_IMG,
    CUBES,
    UPRIGHT_CONES,
    TIPPED_CONES,
    SUBMIT_FORM
};

let state = ProgramState.LOADING_IMG;
setWaitingImg();

function getState(): ProgramState {
    return state;
}

function nextState() {
    switch (state) {
        case ProgramState.LOADING_IMG:
            state = ProgramState.CUBES;
            setCube();
            break;
    }
}

export { getState, nextState, ProgramState };