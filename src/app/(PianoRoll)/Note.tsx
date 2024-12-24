import { useEffect } from "react";
import { NoteJSON } from "../types/Midi";
import { ALL_NOTES, TICKS_PER_16TH } from "./constants";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useDragSelect } from "./DragContext";

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
    const { attributes, listeners, setNodeRef, node, transform } = useDraggable({
        id: noteId,
        data: note,
        disabled: !draggable,
    });

    const ds = useDragSelect();
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

    // adding a selectable element
  useEffect(() => {
    const element = node.current as unknown as HTMLElement;
    if (!element || !ds) return;
    ds.addSelectables(element);
  }, [ds, node]);

  // subscribing to a callback
  useEffect(() => {
    if (!ds) return;
    const id = ds.subscribe("DS:end", (e) => {
      // do something
      console.log(e);
    });

    return () => ds.unsubscribe("DS:end", undefined, id!);
  }, [ds]);


    return (
        <div
            id={noteId}
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            //  Don't have a unique id unfortunately
            key={noteId}
            className={colorVariants[color]}
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
