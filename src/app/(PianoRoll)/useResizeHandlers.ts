import { useState } from "react";
import { ExtendedNoteJSON } from "../(BigButton)/useManageNotes";
import { ticksFromWidth } from "./PianoRoll";

export default function useResizeHandlers(
    selectedNotes: ExtendedNoteJSON[],
    setSelectedNotes: (notes: ExtendedNoteJSON[]) => void,
    cellWidth: number,
    updateNotes: (
        oldNotes: ExtendedNoteJSON[],
        newNotes: ExtendedNoteJSON[]
    ) => void
): {
    resizeWidth: number;
    commitResize: () => void;
    handleResize: (note: ExtendedNoteJSON, resizeWidth: number) => void;
} {
    const [resizeWidth, setResizeWidth] = useState(0);

    function commitResize() {
        // Create new, resized notes
        const newNotes = selectedNotes.map((note) => {
            return {
                ...note,
                durationTicks:
                    note.durationTicks + ticksFromWidth(resizeWidth, cellWidth),
            };
        });
        updateNotes(selectedNotes, newNotes);
        // Set the selected notes to the new notes
        setSelectedNotes(newNotes);
        // Reset the resize width
        setResizeWidth(0);
    }

    function handleResize(note: ExtendedNoteJSON, resizeWidth: number) {
        // if selected th
        if (!selectedNotes.includes(note)) {
            setSelectedNotes([note]);
            setResizeWidth(resizeWidth);
        } else {
            setResizeWidth(resizeWidth);
        }
    }

    return { commitResize, handleResize, resizeWidth };
}
