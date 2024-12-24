// This funtion determines where a note shoudl move once it is dropped.
// dnd-kits useDroppable hook slows down the app, so we need to implement this manually.

import { ExtendedNoteJSON } from "../(BigButton)/useManageNotes";
import { NoteJSON } from "../types/Midi";
import { ALL_NOTES, TICKS_PER_16TH } from "./constants";

function calculateNoteY(noteName: string, cellHeight: number) {
    const noteIndex = ALL_NOTES.indexOf(noteName);
    return noteIndex * cellHeight;
}

export function getAllNotesYPositions(cellHeight: number) {
    return ALL_NOTES.map((noteName) => calculateNoteY(noteName, cellHeight));
}

function calculateQuantizedTicks(ticks: number) {
    const quantizedTicks = Math.round(ticks / TICKS_PER_16TH) * TICKS_PER_16TH;
    // If user drags note to the left of the piano roll, then the ticks will be negative.
    // We don't want to allow negative ticks, so we set them to 0.
    if (quantizedTicks < 0) {
        return 0;
    }

    return quantizedTicks;
}


export function deriveNewNote(
    transformX: number,
    transformY: number,
    cellHeight: number,
    oldNote: NoteJSON,
    quantized: boolean = true
): ExtendedNoteJSON | null {
    // Say you have a note that is at 300px on the y-axis from 0 -> height px.
    // You want to find the first note that is greater than 300 px to get the note that is below the note you are dropping.
    const yPositions = getAllNotesYPositions(cellHeight);
    // original note position plus the y-transform value
    const yPosition = calculateNoteY(oldNote.name, cellHeight)  + transformY
    // offset the y-position to get the middle of the note so that which note is below is determined by the middle of the note
    const offsetYPosition = yPosition - (cellHeight / 2);
    // y-axis maps to note names so derive the note name from the y-position
    let newNoteIndex = yPositions.findIndex((y) => y > offsetYPosition);
    // If the note is below the lowest note, then we want to move it to the lowest note but it won't be found using the above logic
    if (newNoteIndex === -1) {
        newNoteIndex = ALL_NOTES.length - 1;
    }

    const newNoteName = ALL_NOTES[newNoteIndex];

    const xPosition = oldNote.ticks + transformX
    // similarly, offset the x-position to get the middle of the note so that which note is to the right of the note you are dropping is determined by the middle of the note
    const offsetX = xPosition - TICKS_PER_16TH / 2;
    const newStartTicks = quantized ? calculateQuantizedTicks(xPosition) : xPosition;
    return {...oldNote, name: newNoteName, ticks: newStartTicks}
}
