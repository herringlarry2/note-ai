"use client";

import React from "react";
import { ALL_NOTES } from "./constants";
import Note from "./Note";
import PianoRollRow from "./PianoRow";
import { ExtendedNoteJSON } from "../(BigButton)/useManageNotes";

export default function PianoGrid({
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
