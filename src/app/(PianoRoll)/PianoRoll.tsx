"use client";

import React, { useCallback } from "react";
import { ALL_NOTES, TICKS_PER_16TH } from "./constants";
import Note from "./Note";
import { EditMode } from "../(BigButton)/useEditMode";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { deriveNewNote } from "./deriveNewNote";
import { ExtendedNoteJSON } from "../(BigButton)/useManageNotes";
import PianoRollRow from "./PianoRow";
import getGridDimensions from "./getGridDimensions";

// Current Notes

// Prospective candidates

// Requirements
// 1. If there are suggestions, then we should display them
// 2. The suggestions should be displayed as a different color
// 3. Users can commit these suggestions or cycle through them

// TODO(will): This should be a user setting. Also maybe can add more fine-grained control over quantization.
const QUANTIZED = true;

function createNote(noteName: string, ticks: number) {
    return {
        name: noteName,
        velocity: 1,
        ticks: ticks,
        durationTicks: TICKS_PER_16TH,
        time: 0,
        midi: 0,
        duration: 0,
        committed: true,
    };
}

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
    const { cellHeight, cellWidth, totalColumns, totalWidth } =
        getGridDimensions(notes, width, height);

    // Extract handlers into separate functions for clarity
    const handleCellClick = useCallback(
        (noteName: string, columnIndex: number) => {
            if (mode !== "write") return;

            const ticks = columnIndex * TICKS_PER_16TH;
            const newNote: ExtendedNoteJSON = createNote(noteName, ticks);
            addNotes([newNote]);
        },
        [mode, addNotes]
    );

    const handleNoteClick = (index: number, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent triggering handleCellClick
        // If we are in write mode, then we should delete the note
        if (mode === "write") {
            removeNotes([notes[index]]);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        // old note
        const oldNote = event.active.data.current as ExtendedNoteJSON;
        // new note
        const newNote = deriveNewNote(
            event.delta.x,
            event.delta.y,
            cellHeight,
            oldNote,
            QUANTIZED
        );

        if (newNote === null) {
            return;
        }
        // remove old note + add new note
        removeNotes([oldNote]);
        addNotes([newNote]);
    };

    const isDraggable = mode === "point";

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <div
                className="relative border border-zinc-700 overflow-auto"
                style={{ width, height }}
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
                            key={`note-${index}-${note.name}`}
                            note={note}
                            cellWidth={cellWidth}
                            cellHeight={cellHeight}
                            index={index}
                            onClick={(e) => handleNoteClick(index, e)}
                            color={note.committed ? "emerald" : "orange"}
                            draggable={isDraggable}
                        />
                    );
                })}
            </div>
        </DndContext>
    );
}
