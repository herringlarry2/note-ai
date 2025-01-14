import { useCallback } from "react";
import { ExtendedNoteJSON } from "../(BigButton)/useManageNotes";
import { TICKS_PER_16TH } from "./constants";
import { EditMode } from "../(BigButton)/useEditMode";

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

export function useNoteHandlers(
    mode: EditMode,
    addNotes: (newNotes: ExtendedNoteJSON[]) => void,
    removeNotes: (notes: ExtendedNoteJSON[]) => void,
    setSelectedNotes: (notes: ExtendedNoteJSON[]) => void,
    notes: ExtendedNoteJSON[]
) {
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
        } else {
            setSelectedNotes([notes[index]]);
        }
    };

    return { handleCellClick, handleNoteClick };
}
