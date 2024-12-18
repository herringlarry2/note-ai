"use client";

import React from "react";
import { NoteJSON } from "../types/Midi";
import { ALL_NOTES, TICKS_PER_16TH } from "./constants";
import Note from "./Note";
import NoteCell from "./NoteCell";
import NoteLabel from "./NoteLabel";

export function PianoRoll({
    notes,
    setNotes,
    width,
    height,
}: {
    notes: NoteJSON[];
    setNotes: React.Dispatch<React.SetStateAction<NoteJSON[]>>;
    width: number;
    height: number;
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
        const newNote: NoteJSON = {
            name: noteName,
            velocity: 1,
            ticks: columnIndex * TICKS_PER_16TH,
            durationTicks: TICKS_PER_16TH,
            time: 0,
            midi: 0,
            duration: 0,
        };
        setNotes((prev) => [...prev, newNote]);
    };

    const handleNoteClick = (index: number, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent triggering handleCellClick
        setNotes((prev) => prev.filter((_, i) => i !== index));
    };

    return (
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
                        note={note}
                        cellWidth={cellWidth}
                        cellHeight={cellHeight}
                        index={index}
                        onClick={(e) => handleNoteClick(index, e)}
                    />
                );
            })}
        </div>
    );
}
