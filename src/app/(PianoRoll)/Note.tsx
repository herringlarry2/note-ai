import { DSInputElement } from "dragselect";
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
    isSelected,
}: {
    note: NoteJSON;
    cellWidth: number;
    cellHeight: number;
    index: number;
    onClick: (e: React.MouseEvent) => void;
    color?: "emerald" | "orange";
    draggable: boolean;
    isSelected: boolean;
}) {
    const noteId = `note-${index}-${note.name}-${note.ticks}-${note.durationTicks}`;
    const ds = useDragSelect();
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (draggable && ds && ref.current) {
            const current = ref.current;
            ds.addSelectables(current);

            // Add to selection if isSelected is true
            if (isSelected) {
                ds.addSelection(current);
            }

            return () => {
                ds.removeSelectables(current);
                ds.removeSelection(current);
            };
        }
    }, [draggable, ds, noteId, isSelected]);

    const rowIndex = ALL_NOTES.indexOf(note.name);
    const left = (note.ticks / TICKS_PER_16TH) * cellWidth + 48; // Add 48px for labels
    const width = (note.durationTicks / TICKS_PER_16TH) * cellWidth;

    const colorVariants = {
        emerald:
            "absolute rounded-sm shadow-md bg-emerald-500 hover:bg-emerald-400 cursor-pointer transition-colors",
        orange: "absolute rounded-sm shadow-md bg-orange-500 hover:bg-orange-400 cursor-pointer transition-colors",
        emeraldSelected:
            "absolute rounded-sm shadow-md bg-emerald-500 hover:bg-emerald-400 cursor-pointer transition-color ring-2 ring-white",
        orangeSelected:
            "absolute rounded-sm shadow-md bg-orange-500 hover:bg-orange-400 cursor-pointer transition-colors transition-colors ring-2 ring-white",
    };

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        onClick(e);
    };

    // const colorKey = isSelected ? `${color}Selected` : color;
    const colorKey = color;

    return (
        <div
            id={noteId}
            ref={ref}
            //  Don't have a unique id unfortunately
            draggable={false}
            key={noteId}
            className={colorVariants[colorKey as keyof typeof colorVariants]}
            style={{
                top: rowIndex * cellHeight + 1,
                left,
                width,
                height: cellHeight - 2,
                border: isSelected ? "2px solid white" : "none",
            }}
            onClick={handleClick}
        />
    );
}
