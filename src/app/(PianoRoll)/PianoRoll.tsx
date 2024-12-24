"use client";

import React from "react";
import { NoteJSON } from "../types/Midi";
import { ALL_NOTES, TICKS_PER_16TH } from "./constants";
import Note from "./Note";
import NoteCell from "./NoteCell";
import NoteLabel from "./NoteLabel";
import { EditMode } from "../(BigButton)/useEditMode";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { deriveNewNote } from "./deriveNewNote";
import { ExtendedNoteJSON } from "../(BigButton)/useManageNotes";

// Current Notes

// Prospective candidates

// Requirements
// 1. If there are suggestions, then we should display them
// 2. The suggestions should be displayed as a different color
// 3. Users can commit these suggestions or cycle through them

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
    const cellHeight = Math.max(height / ALL_NOTES.length, 20);
    const cellWidth = TICKS_PER_16TH;
    const maxTicks =
        notes.length > 0
            ? Math.max(...notes.map((n) => n.ticks + n.durationTicks))
            : 0;
    const minimumColumns = Math.max(
        Math.ceil(maxTicks / TICKS_PER_16TH) + 4,
        Math.floor(width / cellWidth)
    );

    const totalColumns = minimumColumns;

    const totalWidth = Math.max(width, totalColumns * cellWidth + 48);

    const handleCellClick = (noteName: string, columnIndex: number) => {
        if (mode === "write") {
            const newNote: ExtendedNoteJSON = {
                name: noteName,
                velocity: 1,
                ticks: columnIndex * TICKS_PER_16TH,
                durationTicks: TICKS_PER_16TH,
                time: 0,
                midi: 0,
                duration: 0,
                committed: true,
            };
            addNotes([newNote]);
        }
    };

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
        const newNote = deriveNewNote(event.delta.x, event.delta.y, cellHeight, oldNote,QUANTIZED);

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
                {/* Piano Roll Note Labels */}
                {ALL_NOTES.map((noteName) => (
                    <div
                        key={noteName}
                        className="relative"
                        style={{ height: cellHeight }}
                    >
                        {/* Note Label */}
                        <NoteLabel noteName={noteName} />
                        {/* Grid Cells */}
                        {Array.from({ length: totalColumns }).map(
                            (_, colIndex) => (
                                <NoteCell
                                    key={`note-cell-${noteName}-${colIndex}`}
                                    noteName={noteName}
                                    colIndex={colIndex}
                                    cellWidth={cellWidth}
                                    cellHeight={cellHeight}
                                    onClick={() =>
                                        handleCellClick(noteName, colIndex)
                                    }
                                />
                            )
                        )}
                    </div>
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
