"use client";

import React, { useRef, useState } from "react";
import { TICKS_PER_16TH } from "./constants";
import { EditMode } from "../(BigButton)/useEditMode";
import { ExtendedNoteJSON } from "../(BigButton)/useManageNotes";
import getGridDimensions from "./getGridDimensions";
import { DragSelectProvider } from "./DragSelectProvider";
import useResizeHandlers from "./useResizeHandlers";
import { useNoteHandlers } from "./useNoteHandlers";
import useDragHandlers from "./useDragHandlers";
import PianoGrid from "./PianoGrid";

export function widthFromDurationTicks(ticks: number, cellWidth: number) {
    return (ticks / TICKS_PER_16TH) * cellWidth;
}

export function ticksFromWidth(width: number, cellWidth: number) {
    return (width / cellWidth) * TICKS_PER_16TH;
}

// TODO(will): This should be a user setting. Also maybe can add more fine-grained control over quantization.
const QUANTIZED = true;

export function PianoRoll({
    notes,
    addNotes,
    removeNotes,
    width,
    height,
    mode,
}: {
    notes: ExtendedNoteJSON[];
    addNotes: (newNotes: ExtendedNoteJSON[]) => void;
    removeNotes: (notes: ExtendedNoteJSON[]) => void;
    width: number;
    height: number;
    mode: EditMode;
}) {
    const dragContainer = useRef<HTMLDivElement>(null);

    const [selectedNotes, setSelectedNotes] = useState<ExtendedNoteJSON[]>([]);

    const { cellHeight, cellWidth, totalColumns, totalWidth } =
        getGridDimensions(notes, width, height);

    function updateNotes(
        oldNotes: ExtendedNoteJSON[],
        newNotes: ExtendedNoteJSON[]
    ) {
        removeNotes(oldNotes);
        addNotes(newNotes);
    }

    // When you drag the end of a note to resize it
    const { commitResize, handleResize, resizeWidth } = useResizeHandlers(
        selectedNotes,
        setSelectedNotes,
        cellWidth,
        updateNotes
    );

    // When you click an empty cell or a note, only used in "write" mode
    const { handleCellClick, handleNoteClick } = useNoteHandlers(
        mode,
        addNotes,
        removeNotes,
        setSelectedNotes,
        notes
    );

    // When you drag a note, only used in "point" mode
    const { handleDragEnd, handleDragSelect, isDraggable } = useDragHandlers(
        mode,
        notes,
        cellHeight,
        QUANTIZED,
        updateNotes,
        setSelectedNotes
    );

    return (
        <DragSelectProvider
            settings={{
                area: dragContainer.current ?? undefined,
            }}
            handleDragEnd={handleDragEnd}
            handleDragSelect={handleDragSelect}
        >
            {/* In charge of rendering the grid and notes and hooking up the resize and drag handlers */}
            <PianoGrid
                notes={notes}
                // Dimensions
                cellWidth={cellWidth}
                cellHeight={cellHeight}
                // Container width and height (can scroll to access total width and height)
                width={width}
                height={height}
                // Total width and height with scroll
                totalWidth={totalWidth}
                totalColumns={totalColumns}
                // Handlers
                handleCellClick={handleCellClick}
                handleNoteClick={handleNoteClick}
                commitResize={commitResize}
                handleResize={handleResize}
                // Drag + Resize state
                selectedNotes={selectedNotes}
                isDraggable={isDraggable}
                resizeWidth={resizeWidth}
                dragContainer={dragContainer}
            />
        </DragSelectProvider>
    );
}
