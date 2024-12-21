"use client";

import React, { useEffect, useRef } from "react";
import { NoteJSON } from "../types/Midi";
import { ALL_NOTES, TICKS_PER_16TH } from "./constants";
import { EditMode } from "../(BigButton)/useEditMode";

export function PianoRollCanvas({
    incumbentNotes,
    candidateNotes,
    setNotes,
    width,
    height,
    mode,
}: {
    incumbentNotes: NoteJSON[];
    candidateNotes: NoteJSON[];
    setNotes: React.Dispatch<React.SetStateAction<NoteJSON[]>>;
    width: number;
    height: number;
    mode: EditMode;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const labelsRef = useRef<HTMLCanvasElement>(null);
    const notes = [...incumbentNotes, ...candidateNotes];

    const cellHeight = Math.max(height / ALL_NOTES.length, 20);
    const totalHeight = cellHeight * ALL_NOTES.length;
    const cellWidth = TICKS_PER_16TH;
    const maxTicks =
        notes.length > 0
            ? Math.max(...notes.map((n) => n.ticks + n.durationTicks))
            : 0;
    const minimumColumns = Math.max(
        Math.ceil(maxTicks / TICKS_PER_16TH) + 4,
        Math.floor(width / cellWidth)
    );
    const totalWidth = Math.max(width, minimumColumns * cellWidth + 48);

    // Add new useEffect for labels canvas
    useEffect(() => {
        const canvas = labelsRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        canvas.width = 48 * dpr;
        canvas.height = totalHeight * dpr;
        ctx.scale(dpr, dpr);

        // Clear canvas
        ctx.clearRect(0, 0, 48, totalHeight);

        // Draw note labels
        ctx.fillStyle = "#e4e4e7"; // zinc-200
        ctx.font = "12px sans-serif";
        ALL_NOTES.forEach((noteName, index) => {
            const y = index * cellHeight + cellHeight / 2 + 4;
            ctx.fillText(noteName, 4, y);
        });
    }, [cellHeight, totalHeight]);

    // Handle canvas drawing
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Set canvas size with device pixel ratio for sharp rendering
        const dpr = window.devicePixelRatio || 1;
        canvas.width = totalWidth * dpr;
        canvas.height = totalHeight * dpr;
        ctx.scale(dpr, dpr);

        // Clear canvas
        ctx.clearRect(0, 0, totalWidth, totalHeight);

        // Draw background for white keys
        ctx.fillStyle = "#27272a"; // zinc-800
        ALL_NOTES.forEach((noteName, index) => {
            if (!noteName.includes("#")) {
                ctx.fillRect(0, index * cellHeight, totalWidth, cellHeight);
            }
        });

        // Draw grid
        ctx.strokeStyle = "#3f3f46"; // zinc-700
        ctx.lineWidth = 1;

        // Draw horizontal lines
        ALL_NOTES.forEach((_, index) => {
            const y = index * cellHeight;
            ctx.beginPath();
            ctx.moveTo(48, y);
            ctx.lineTo(totalWidth, y);
            ctx.stroke();
        });

        // Draw vertical lines
        for (let i = 0; i < minimumColumns; i++) {
            const x = i * cellWidth + 48;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, totalHeight);
            ctx.stroke();
        }

        // Draw incumbent notes
        incumbentNotes.forEach((note) => {
            const noteIndex = ALL_NOTES.findIndex((n) => n === note.name);
            if (noteIndex === -1) return;

            ctx.fillStyle = "#34d399"; // emerald-400
            ctx.fillRect(
                note.ticks + 48,
                noteIndex * cellHeight + 1,
                note.durationTicks,
                cellHeight - 2
            );
        });

        // Draw candidate notes
        candidateNotes.forEach((note) => {
            const noteIndex = ALL_NOTES.findIndex((n) => n === note.name);
            if (noteIndex === -1) return;

            ctx.fillStyle = "#fb923c"; // orange-400
            ctx.fillRect(
                note.ticks + 48,
                noteIndex * cellHeight + 1,
                note.durationTicks,
                cellHeight - 2
            );
        });
    }, [
        incumbentNotes,
        candidateNotes,
        totalWidth,
        height,
        cellHeight,
        cellWidth,
        minimumColumns,
    ]);

    // Handle click events
    const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas || mode !== "write") return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left - 48;
        const y = e.clientY - rect.top;

        const columnIndex = Math.floor(x / cellWidth);
        const noteIndex = Math.floor(y / cellHeight);

        if (
            columnIndex >= 0 &&
            noteIndex >= 0 &&
            noteIndex < ALL_NOTES.length
        ) {
            const noteName = ALL_NOTES[noteIndex];
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
        }
    };

    return (
        <div
            className="relative border border-zinc-700 overflow-auto"
            style={{ width, height }}
        >
            <canvas
                ref={labelsRef}
                className="absolute left-0 top-0 z-10 bg-zinc-900"
                style={{ width: 48, height: totalHeight }}
            />
            <canvas
                ref={canvasRef}
                onClick={handleCanvasClick}
                style={{ width: totalWidth, marginLeft: 48 }}
            />
        </div>
    );
}
