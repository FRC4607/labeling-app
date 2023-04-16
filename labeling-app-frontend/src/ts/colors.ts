import { getState } from "./state";

const colors: Map<number, string[]> = new Map();
colors.set(0, ["rgba(128, 0, 128, 1.0)", "rgba(128, 0, 128, 0.25)"]);
colors.set(1, ["rgba(255, 255, 0, 1.0)", "rgba(255, 255, 0, 0.25)"]);
colors.set(2, ["rgba(255, 0, 0, 1.0)", "rgba(255, 255, 0, 0.25)"]);

function getPrimaryColor(): string {
    return colors.get(getState())![0];
}

function getSecondaryColor(): string {
    return colors.get(getState())![1]
}

export {getPrimaryColor, getSecondaryColor}