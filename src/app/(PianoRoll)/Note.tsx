import { NoteJSON } from "../types/Midi";
import { ALL_NOTES, TICKS_PER_16TH } from "./constants";
import { useDragSelect } from "./DragSelectProvider";
import { useEffect, useRef, useState } from "react";
import { Resizable } from "react-resizable";

import { widthFromDurationTicks } from "./PianoRoll";

const colorVariants = {
    emerald:
        "absolute rounded-sm shadow-md bg-emerald-500 hover:bg-emerald-400 cursor-pointer transition-colors",
    orange: "absolute rounded-sm shadow-md bg-orange-500 hover:bg-orange-400 cursor-pointer transition-colors",
    emeraldSelected:
        "absolute rounded-sm shadow-md bg-emerald-500 hover:bg-emerald-400 cursor-pointer transition-color ring-2 ring-white",
    orangeSelected:
        "absolute rounded-sm shadow-md bg-orange-500 hover:bg-orange-400 cursor-pointer transition-colors transition-colors ring-2 ring-white",
};

export default function Note({
    note,
    cellWidth,
    cellHeight,
    index,
    onClick,
    color = "emerald",
    draggable,
    isSelected,
    resizeWidth,
    handleResize,
    commitResize,
}: {
    note: NoteJSON;
    cellWidth: number;
    cellHeight: number;
    index: number;
    onClick: (e: React.MouseEvent) => void;
    color?: "emerald" | "orange";
    draggable: boolean;
    isSelected: boolean;
    resizeWidth: number;
    handleResize: (width: number) => void;
    commitResize: () => void;
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
    const originalWidth = widthFromDurationTicks(note.durationTicks, cellWidth);
    const width = originalWidth + (isSelected ? resizeWidth : 0);

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        onClick(e);
    };

    // const colorKey = isSelected ? `${color}Selected` : color;
    const colorKey = color;

    return (
        <Resizable
            width={width}
            axis="x"
            height={cellHeight - 2}
            onResize={(e: any, { size }: any) => {
                e.preventDefault();
                // Prevent the drag select from being triggered
                ds?.break();
                handleResize(size.width - originalWidth);
            }}
            onResizeStop={(e: any, { size }: any) => {
                // Prevent the drag select from being triggered
                ds?.break();
                commitResize();
            }}
            handle={
                <div
                    className="absolute right-0 w-2 h-full bg-transparent cursor-col-resize"
                    onClick={(e) => e.preventDefault()}
                />
            }
        >
            <div
                //  Don't have a unique id unfortunately
                id={noteId}
                ref={ref}
                draggable={false}
                key={noteId}
                className={
                    colorVariants[colorKey as keyof typeof colorVariants]
                }
                style={{
                    width,
                    height: cellHeight - 2,
                    top: rowIndex * cellHeight + 1,
                    left,
                    border: isSelected ? "2px solid white" : "none",
                }}
                onClick={handleClick}
            />
        </Resizable>
    );
}
