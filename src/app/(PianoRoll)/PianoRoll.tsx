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
import useDragResize from "./useDragResize";
import { useNoteHandlers } from "./useNoteHandlers";

export function widthFromDurationTicks(ticks: number, cellWidth: number) {
    return (ticks / TICKS_PER_16TH) * cellWidth;
}

export function ticksFromWidth(width: number, cellWidth: number) {
    return (width / cellWidth) * TICKS_PER_16TH;
}

// TODO(will): This should be a user setting. Also maybe can add more fine-grained control over quantization.
const QUANTIZED = true;

function getNoteFromId(id: string, notes: ExtendedNoteJSON[]) {
    const [_, _1, noteName, ticks, durationTicks] = id.split("-");
    return notes.find(
        (n) =>
            n.name === noteName &&
            n.ticks === parseInt(ticks) &&
            n.durationTicks === parseInt(durationTicks)
    );
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
    const dragContainer = useRef<HTMLDivElement>(null);

    const [selectedNotes, setSelectedNotes] = useState<ExtendedNoteJSON[]>([]);

    const { cellHeight, cellWidth, totalColumns, totalWidth } =
        getGridDimensions(notes, width, height);

    const { commitResize, handleResize, resizeWidth } = useDragResize(
        selectedNotes,
        setSelectedNotes,
        cellWidth,
        removeNotes,
        addNotes
    );

    // Cell click is for when there's no note
    const { handleCellClick, handleNoteClick } = useNoteHandlers(
        mode,
        addNotes,
        removeNotes,
        setSelectedNotes,
        notes
    );

    const updateNotes = ({
        items,
        event,
    }: {
        items: DSInputElement[];
        event?: MouseEvent | TouchEvent | null | undefined | KeyboardEvent;
    }) => {
        if (!items.length) return;

        const noteIds = items.map((item) => item.id);
        const notesFromIds = noteIds.map((id) => {
            return getNoteFromId(id, notes);
        });

        const transform = items[0].style.transform;
        // No transform means we are not dragging
        if (!transform) return;

        // Get the transform values
        const transformX = transform.split("(")[1].split(",")[0];
        const transformY = transform.split("(")[1].split(",")[1];

        // Remove the old selected notes
        removeNotes(notesFromIds.filter((n) => n !== undefined));

        // Create new, relocated notes
        const notesToAdd = notesFromIds
            .filter((n) => n !== undefined)
            .map((n) =>
                deriveNewNote(
                    parseInt(transformX),
                    parseInt(transformY),
                    cellHeight,
                    n,
                    QUANTIZED
                )
            )
            .filter((n) => n !== null);

        // Add the new notes
        addNotes(notesToAdd);
        // Set the selected notes to the new notes
        setSelectedNotes(notesToAdd);
    };

    const isDraggable = mode === "point";

    return (
        <DragSelectProvider
            settings={{
                area: dragContainer.current ?? undefined,
            }}
            onDragEnd={updateNotes}
            onDragSelect={(items: DSInputElement[]) => {
                setSelectedNotes(
                    items
                        .map((item) => getNoteFromId(item.id, notes))
                        .filter((n) => n !== undefined)
                );
            }}
        >
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
        </DragSelectProvider>
    );
}
