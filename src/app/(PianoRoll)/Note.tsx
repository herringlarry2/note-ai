import { useEffect } from "react";
import { NoteJSON } from "../types/Midi";
import { ALL_NOTES, TICKS_PER_16TH } from "./constants";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

export default function Note({
    note,
    cellWidth,
    cellHeight,
    index,
    onClick,
    color = "emerald",
    transform,
    selected,
}: {
    note: NoteJSON;
    cellWidth: number;
    cellHeight: number;
    index: number;
    onClick: (e: React.MouseEvent) => void;
    color?: "emerald" | "orange";
    transform: typeof CSS.Transform;
    selected: boolean;
}) {
    const noteId = `note-${index}-${note.name}`;
    const rowIndex = ALL_NOTES.indexOf(note.name);
    const left = (note.ticks / TICKS_PER_16TH) * cellWidth + 48; // Add 48px for labels
    const width = (note.durationTicks / TICKS_PER_16TH) * cellWidth;
    const colorVariants = {
        emerald:
            "absolute rounded-sm shadow-md bg-emerald-500 hover:bg-emerald-400 cursor-pointer transition-colors",
        emeraldSelected:
            "absolute rounded-sm shadow-md bg-emerald-400 hover:bg-emerald-300 cursor-pointer transition-colors ring-2 ring-emerald-200",
        orange: "absolute rounded-sm shadow-md bg-orange-500 hover:bg-orange-400 cursor-pointer transition-colors",
        orangeSelected:
            "absolute rounded-sm shadow-md bg-orange-00 hover:bg-orange-300 cursor-pointer transition-colors ring-2 ring-orange-200",
    };

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onClick(e);
    };

    return (
        <div
            id={noteId}
            //  Don't have a unique id unfortunately
            key={noteId}
            className={colorVariants[`${color}${selected ? "Selected" : ""}`]}
            style={{
                top: rowIndex * cellHeight + 1,
                left,
                width,
                height: cellHeight - 2,
                transform: CSS.Transform.toString(transform),
            }}
            onClick={handleClick}
        />
    );
}
