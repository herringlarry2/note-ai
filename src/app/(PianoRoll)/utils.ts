import { TICKS_PER_16TH } from "./constants";

export const isBlackKey = (noteName: string) => {
    return noteName.includes("#");
};

export function widthFromDurationTicks(ticks: number, cellWidth: number) {
    return (ticks / TICKS_PER_16TH) * cellWidth;
}

export function ticksFromWidth(width: number, cellWidth: number) {
    return (width / cellWidth) * TICKS_PER_16TH;
}
