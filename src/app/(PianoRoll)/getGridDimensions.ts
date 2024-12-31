import { ALL_NOTES, TICKS_PER_16TH } from "./constants";
import { ExtendedNoteJSON } from "../(BigButton)/useManageNotes";

export default function getGridDimensions(
    notes: ExtendedNoteJSON[],
    width: number,
    height: number
) {
    const cellHeight = Math.max(height / ALL_NOTES.length, 20);
    const cellWidth = TICKS_PER_16TH;
    const maxTicks =
        notes.length > 0
            ? Math.max(...notes.map((n) => n.ticks + n.durationTicks))
            : 0;
    const minimumColumns = Math.max(
        Math.ceil(maxTicks / TICKS_PER_16TH) + 4,
        Math.floor(width / cellWidth)
    );
    const totalWidth = Math.max(width, minimumColumns * cellWidth + 48);

    return {
        cellHeight,
        cellWidth,
        totalColumns: minimumColumns,
        totalWidth,
    };
}
