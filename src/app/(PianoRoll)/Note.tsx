import { NoteJSON } from "../types/Midi";
import { ALL_NOTES, TICKS_PER_16TH } from "./constants";
import { isBlackKey } from "./utils";

export default function Note({
    note,
    cellWidth,
    cellHeight,
    index,
    onClick,
}: {
    note: NoteJSON;
    cellWidth: number;
    cellHeight: number;
    index: number;
    onClick: (e: React.MouseEvent) => void;
}) {
    const rowIndex = ALL_NOTES.indexOf(note.name);
    const left = (note.ticks / TICKS_PER_16TH) * cellWidth + 48; // Add 48px for labels
    const width = (note.durationTicks / TICKS_PER_16TH) * cellWidth;

    return (
        <div
            id={`note-${index}`}
            //  Don't have a unique id unfortunately
            key={`note-${index}-${note.name}`}
            className={`absolute rounded-sm shadow-md cursor-pointer
                ${
                    !isBlackKey(note.name)
                        ? "bg-emerald-500 hover:bg-emerald-400"
                        : "bg-emerald-400 hover:bg-emerald-300"
                }
                transition-colors
            `}
            style={{
                top: rowIndex * cellHeight + 1,
                left,
                width,
                height: cellHeight - 2,
            }}
            onClick={onClick}
        />
    );
}
