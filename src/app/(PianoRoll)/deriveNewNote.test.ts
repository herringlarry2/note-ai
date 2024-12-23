import { deriveNewNote, getAllNotesYPositions } from "./deriveNewNote";
import { NoteJSON } from "../types/Midi";
import { ALL_NOTES, TICKS_PER_16TH } from "./constants";

const mockNote: NoteJSON = {
    name: "C4",
    velocity: 1,
    ticks: 0,
    durationTicks: TICKS_PER_16TH,
    time: 0,
    midi: 0,
    duration: 0
};

const cellHeight = 20;

describe("deriveNewNote", () => {
    it("should return highest note if note is dragged above the piano roll", () => {
        const allNotesYPositions = getAllNotesYPositions(cellHeight);
        // Use the notes to calculate boardHeight then add 100 just to be sure
        const yAbove = -(allNotesYPositions[allNotesYPositions.length - 1] + 100);
        const result = deriveNewNote(0, yAbove, cellHeight, mockNote);
        expect(result?.name).toBe(ALL_NOTES[0]);
    });

    it("should return lowest note if note is dragged below the piano roll", () => {
        const allNotesYPositions = getAllNotesYPositions(cellHeight);
        // Use the notes to calculate boardHeight then add 100 just to be sure
        const yBelow = allNotesYPositions[allNotesYPositions.length - 1] + 100;
        const result = deriveNewNote(0, yBelow, cellHeight, mockNote);
        expect(result?.name).toBe(ALL_NOTES[ALL_NOTES.length - 1]);
    });

    it("should quantize note position to nearest 16th note", () => {
        const result = deriveNewNote(TICKS_PER_16TH * 1.4, 0, cellHeight, mockNote);
        expect(result?.ticks).toBe(TICKS_PER_16TH);
    });

    it("should not allow negative tick values", () => {
        const result = deriveNewNote(-TICKS_PER_16TH * 2, 0, cellHeight, mockNote);
        expect(result?.ticks).toBe(0);
    });

    it("Moving note up by cell height should move note up one semitone", () => {
        const result = deriveNewNote(0, -cellHeight, cellHeight, mockNote);
        expect(result?.name).toBe("C#4");
    });

    it("Moving note down by cell height should move note down one semitone", () => {
        const result = deriveNewNote(0, cellHeight, cellHeight, mockNote);
        expect(result?.name).toBe("B3");
    });

    it("should not quantize when quantized is false", () => {
        const nonQuantizedPosition = TICKS_PER_16TH * 1.4;
        const result = deriveNewNote(nonQuantizedPosition, 0, cellHeight, mockNote, false);
        expect(result?.ticks).toBe(nonQuantizedPosition);
    });

    it("should preserve note properties other than position and name", () => {
        const result = deriveNewNote(TICKS_PER_16TH, cellHeight, cellHeight, mockNote);
        expect(result?.velocity).toBe(mockNote.velocity);
        expect(result?.durationTicks).toBe(mockNote.durationTicks);
        expect(result?.time).toBe(mockNote.time);
        expect(result?.midi).toBe(mockNote.midi);
        expect(result?.duration).toBe(mockNote.duration);
    });
});
