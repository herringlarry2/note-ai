import { NoteJSON } from "../types/Midi";
import { ALL_NOTES, TICKS_PER_16TH } from "./constants";
import { useDragSelect } from "./DragSelectProvider";
import { useEffect, useRef } from "react";

export default function Note({
    note,
    cellWidth,
    cellHeight,
    index,
    onClick,
    color = "emerald",
    draggable,
}: {
    note: NoteJSON;
    cellWidth: number;
    cellHeight: number;
    index: number;
    onClick: (e: React.MouseEvent) => void;
    color?: "emerald" | "orange";
    draggable: boolean;
}) {
    const noteId = `note-${index}-${note.name}`;
    const ds = useDragSelect();
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (draggable && ds && ref.current) {
            ds.addSelectables([ref.current]);
        }
    }, [draggable, ds]);

    const rowIndex = ALL_NOTES.indexOf(note.name);
    const left = (note.ticks / TICKS_PER_16TH) * cellWidth + 48; // Add 48px for labels
    const width = (note.durationTicks / TICKS_PER_16TH) * cellWidth;

    const colorVariants = {
        emerald:
            "absolute rounded-sm shadow-md bg-emerald-500 hover:bg-emerald-400 cursor-pointer transition-colors",
        orange: "absolute rounded-sm shadow-md bg-orange-500 hover:bg-orange-400 cursor-pointer transition-colors",
    };

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onClick(e);
    };

    return (
        <div
            id={noteId}
            ref={ref}
            //  Don't have a unique id unfortunately
            key={noteId}
            className={colorVariants[color]}
            style={{
                top: rowIndex * cellHeight + 1,
                left,
                width,
                height: cellHeight - 2,
                position: "absolute",
            }}
            onClick={handleClick}
        />
    );
}
