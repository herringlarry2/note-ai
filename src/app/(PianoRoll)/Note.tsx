import { DSInputElement } from "dragselect";
import { NoteJSON } from "../types/Midi";
import { ALL_NOTES, TICKS_PER_16TH } from "./constants";
import { useDragSelect } from "./DragSelectProvider";
import { useEffect, useRef, useState } from "react";

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
    const [isResizing, setIsResizing] = useState(false);
    const [initialX, setInitialX] = useState(0);
    const [initialWidth, setInitialWidth] = useState(0);

    useEffect(() => {
        if (draggable && ds && ref.current) {
            const current = ref.current;
            if (!isResizing) {
                ds.addSelectables(current);
            }

            if (isSelected && !isResizing) {
                ds.addSelection(current);
            }

            return () => {
                ds.removeSelectables(current);
                ds.removeSelection(current);
            };
        }
    }, [draggable, ds, noteId, isSelected, isResizing]);

    const rowIndex = ALL_NOTES.indexOf(note.name);
    const left = (note.ticks / TICKS_PER_16TH) * cellWidth + 48;
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

    const handleMouseDown = (e: React.MouseEvent) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;

        const rightEdge = rect.right;
        const mouseX = e.clientX;

        if (rightEdge - mouseX <= 12) {
            if (ds && ref.current) {
                console.log("Removing selectables");
                ds.removeSelectables(ref.current);
                ds.removeSelection(ref.current);
            }
            setIsResizing(true);
            setInitialX(mouseX);
            setInitialWidth(rect.width);
            e.stopPropagation();
        } else {
            handleClick(e);
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isResizing) return;

        const deltaX = e.clientX - initialX;
        const newWidth = Math.max(cellWidth, initialWidth + deltaX);
        console.log(ds?.getSelectables());
        console.log(ds?.getSelection());

        if (ref.current) {
            ref.current.style.width = `${newWidth}px`;
            note.durationTicks = Math.round(
                (newWidth / cellWidth) * TICKS_PER_16TH
            );
        }

        e.stopPropagation();
    };

    const handleMouseUp = () => {
        setIsResizing(false);
        if (ds && ref.current && draggable) {
            ds.addSelectables(ref.current);
        }
    };

    console.log(ds?.getSelectables().includes(ref.current));

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        onClick(e);
    };

    const colorKey = color;

    useEffect(() => {
        if (isResizing) {
            document.addEventListener("mousemove", handleMouseMove as any);
            document.addEventListener("mouseup", handleMouseUp);

            return () => {
                document.removeEventListener(
                    "mousemove",
                    handleMouseMove as any
                );
                document.removeEventListener("mouseup", handleMouseUp);
            };
        }
    }, [isResizing]);

    return (
        <div
            id={noteId}
            ref={ref}
            draggable={false}
            key={noteId}
            className={colorVariants[colorKey as keyof typeof colorVariants]}
            style={{
                top: rowIndex * cellHeight + 1,
                left,
                width,
                height: cellHeight - 2,
                border: isSelected ? "2px solid white" : "none",
                cursor: isResizing ? "col-resize" : "pointer",
            }}
            onMouseDown={handleMouseDown}
        />
    );
}
