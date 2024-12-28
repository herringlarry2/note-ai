import { useEffect, useRef } from "react";
import { NoteJSON } from "../types/Midi";
import { ALL_NOTES, TICKS_PER_16TH } from "./constants";
import { CSS } from "@dnd-kit/utilities";
import { useDragSelect } from "./DragProvider";

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
    const rowIndex = ALL_NOTES.indexOf(note.name);
    const left = (note.ticks / TICKS_PER_16TH) * cellWidth + 48; // Add 48px for labels
    const width = (note.durationTicks / TICKS_PER_16TH) * cellWidth;
    const ds = useDragSelect();
    const inputEl = useRef<HTMLDivElement>(null);

    // adding a selectable element
    useEffect(() => {
        const element = inputEl.current as unknown as HTMLElement;
        if (!element || !ds) return;
        ds.addSelectables(element);
    }, [ds, inputEl]);

    const variants = {
        "emerald-unselected":
            "absolute rounded-sm shadow-md bg-emerald-500 hover:bg-emerald-400 cursor-pointer transition-colors",
        "emerald-selected":
            "absolute rounded-sm shadow-md bg-emerald-500 hover:bg-emerald-400 cursor-pointer transition-colors",
        "orange-unselected":
            "absolute rounded-sm shadow-md bg-orange-500 hover:bg-orange-400 cursor-pointer transition-colors",
        "orange-selected":
            "absolute rounded-sm shadow-md bg-orange-500 hover:bg-orange-400 cursor-pointer transition-colors",
    };

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onClick(e);
    };

    return (
        <div
            id={noteId}
            ref={inputEl}
            //  Don't have a unique id unfortunately
            key={noteId}
            className={variants[`${color}-unselected`]}
            style={{
                top: rowIndex * cellHeight + 1,
                left,
                width,
                height: cellHeight - 2,
            }}
            onClick={handleClick}
        />
    );
}
