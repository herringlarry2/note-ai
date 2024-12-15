"use client"

import React from 'react';
import { CompactNoteJSON, NoteJSON } from '../types/Midi';


interface PianoRollProps {
    notes: NoteJSON[];
    setNotes: React.Dispatch<React.SetStateAction<NoteJSON[]>>;
    width: number;
    height: number;
}

const TICKS_PER_16TH = 240;
const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const OCTAVES = [0, 1, 2, 3, 4, 5, 6, 7, 8]
const ALL_NOTES = OCTAVES.map(octave => 
    NOTE_NAMES.map(note => `${note}${octave}`)
).flat().reverse();

const isBlackKey = (noteName: string) => {
    return noteName.includes('#');
};

export const PianoRoll: React.FC<PianoRollProps> = ({ notes, setNotes, width, height }) => {
    const cellHeight = Math.max(height / ALL_NOTES.length, 20);
    const cellWidth = TICKS_PER_16TH;
    const maxTicks = notes.length > 0 
        ? Math.max(...notes.map(n => n.ticks + n.durationTicks)) 
        : 0;
    const minimumColumns = Math.max(
        Math.ceil(maxTicks / TICKS_PER_16TH) + 4,
        Math.floor(width / cellWidth)
    );

    const totalColumns = minimumColumns;

    const totalWidth = Math.max(width, (totalColumns * cellWidth) + 48);

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
        setNotes(prev => [...prev, newNote]);
    };

    const handleNoteClick = (index: number, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent triggering handleCellClick
        setNotes(prev => prev.filter((_, i) => i !== index));
    };


    return (
        <div 
            className="relative border border-zinc-700 overflow-auto"
            style={{ width, height }}
        >
            {/* Grid */}
            <div className="absolute" style={{ width: totalWidth }}>
                {ALL_NOTES.map((noteName, rowIndex) => (
                    <div
                        key={noteName}
                        className="relative"
                        style={{ height: cellHeight }}
                    >
                        {/* Note Label */}
                        <div className="absolute left-0 top-0 w-12 h-full flex items-center justify-center text-xs text-zinc-400 border-r border-zinc-700 bg-zinc-900">
                            {noteName}
                        </div>

                        {/* Grid Cells */}
                        {Array.from({ length: totalColumns }).map((_, colIndex) => (
                            <div
                                key={colIndex}
                                className={`absolute border-r border-b border-zinc-700/50
                                    ${!isBlackKey(noteName) 
                                        ? 'bg-zinc-900 hover:bg-zinc-800' 
                                        : 'bg-zinc-950 hover:bg-zinc-900'
                                    }
                                    transition-colors cursor-pointer
                                `}
                                style={{
                                    top: 0,
                                    left: colIndex * cellWidth + 48, // Add 48px for labels
                                    width: cellWidth,
                                    height: cellHeight,
                                }}
                                onClick={() => handleCellClick(noteName, colIndex)}
                            />
                        ))}
                    </div>
                ))}
            </div>

            {/* Notes */}
            {notes.map((note, index) => {
                const rowIndex = ALL_NOTES.indexOf(note.name);
                const left = (note.ticks / TICKS_PER_16TH) * cellWidth + 48; // Add 48px for labels
                const width = (note.durationTicks / TICKS_PER_16TH) * cellWidth;

                return (
                    <div
                        key={index}
                        className={`absolute rounded-sm shadow-md cursor-pointer
                            ${!isBlackKey(note.name)
                                ? 'bg-emerald-500 hover:bg-emerald-400'
                                : 'bg-emerald-400 hover:bg-emerald-300'
                            }
                            transition-colors
                        `}
                        style={{
                            top: rowIndex * cellHeight + 1,
                            left,
                            width,
                            height: cellHeight - 2,
                        }}
                        onClick={(e) => handleNoteClick(index, e)}
                    />
                );
            })}
        </div>
    );
};
