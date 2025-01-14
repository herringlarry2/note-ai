"use client";

import React, { useCallback, useRef, useState } from "react";
import { ALL_NOTES, TICKS_PER_16TH } from "./constants";
import Note from "./Note";
import { EditMode } from "../(BigButton)/useEditMode";
import { deriveNewNote } from "./deriveNewNote";
import { ExtendedNoteJSON } from "../(BigButton)/useManageNotes";
import PianoRollRow from "./PianoRow";
import getGridDimensions from "./getGridDimensions";
import { DragSelectProvider } from "./DragSelectProvider";
import { DSInputElement } from "dragselect";
import useResizeHandlers from "./useResizeHandlers";
import { useNoteHandlers } from "./useNoteHandlers";
import useDragHandlers from "./useDragHandlers";

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

    // When you drag the end of a note to resize it
    const { commitResize, handleResize, resizeWidth } = useResizeHandlers(
        selectedNotes,
        setSelectedNotes,
        cellWidth,
        removeNotes,
        addNotes
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
        addNotes,
        removeNotes,
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
                width={width}
                height={height}
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

function PianoGrid({
    notes,
    cellWidth,
    cellHeight,
    totalColumns,
    handleCellClick,
    handleNoteClick,
    commitResize,
    handleResize,
    resizeWidth,
    isDraggable,
    selectedNotes,
    dragContainer,
    width,
    height,
    totalWidth,
}: {
    notes: ExtendedNoteJSON[];
    cellWidth: number;
    cellHeight: number;
    totalColumns: number;
    handleCellClick: (noteName: string, colIndex: number) => void;
    handleNoteClick: (index: number, e: React.MouseEvent) => void;
    isDraggable: boolean;
    selectedNotes: ExtendedNoteJSON[];
    resizeWidth: number;
    commitResize: () => void;
    handleResize: (note: ExtendedNoteJSON, resizeWidth: number) => void;
    dragContainer: React.RefObject<HTMLDivElement>;
    width: number;
    height: number;
    totalWidth: number;
}) {
    return (
        <div
            className="relative border border-zinc-700 overflow-auto"
            style={{ width, height }}
            ref={dragContainer}
        >
            {/* Grid */}
            <div className="absolute" style={{ width: totalWidth }}>
                {ALL_NOTES.map((noteName) => (
                    <PianoRollRow
                        key={noteName}
                        noteName={noteName}
                        cellHeight={cellHeight}
                        cellWidth={cellWidth}
                        totalColumns={totalColumns}
                        onCellClick={handleCellClick}
                    />
                ))}
            </div>

            {/* Notes */}
            {notes.map((note, index) => {
                return (
                    <Note
                        key={`note-${index}-${note.name}-${note.ticks}-${note.durationTicks}`}
                        note={note}
                        cellWidth={cellWidth}
                        cellHeight={cellHeight}
                        resizeWidth={resizeWidth}
                        index={index}
                        onClick={(e) => handleNoteClick(index, e)}
                        color={note.committed ? "emerald" : "orange"}
                        draggable={isDraggable}
                        isSelected={selectedNotes.includes(note)}
                        handleResize={(resizeWidth) =>
                            handleResize(note, resizeWidth)
                        }
                        commitResize={commitResize}
                    />
                );
            })}
        </div>
    );
}
