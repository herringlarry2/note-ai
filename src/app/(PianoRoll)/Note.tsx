import { NoteJSON } from "../types/Midi";
import { ALL_NOTES, TICKS_PER_16TH } from "./constants";
import { isBlackKey } from "./utils";

function getClassName(color: "emerald" | "orange") {}

export default function Note({
    note,
    cellWidth,
    cellHeight,
    index,
    onClick,
    color = "emerald",
}: {
    note: NoteJSON;
    cellWidth: number;
    cellHeight: number;
    index: number;
    onClick: (e: React.MouseEvent) => void;
    color?: "emerald" | "orange";
}) {
    const rowIndex = ALL_NOTES.indexOf(note.name);
    const left = (note.ticks / TICKS_PER_16TH) * cellWidth + 48; // Add 48px for labels
    const width = (note.durationTicks / TICKS_PER_16TH) * cellWidth;

    const colorVariants = {
        emerald:
            "absolute rounded-sm shadow-md bg-emerald-500 hover:bg-emerald-400 cursor-pointer transition-colors",
        orange: "absolute rounded-sm shadow-md bg-orange-500 hover:bg-orange-400 cursor-pointer transition-colors",
    };

    return (
        <div
            id={`note-${index}`}
            //  Don't have a unique id unfortunately
            key={`note-${index}-${note.name}`}
            className={colorVariants[color]}
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
