import { DSInputElement } from "dragselect";
import { deriveNewNote } from "./deriveNewNote";
import { EditMode } from "../(BigButton)/useEditMode";
import { ExtendedNoteJSON } from "../(BigButton)/useManageNotes";

function getNoteFromId(id: string, notes: ExtendedNoteJSON[]) {
    const [_, _1, noteName, ticks, durationTicks] = id.split("-");
    return notes.find(
        (n) =>
            n.name === noteName &&
            n.ticks === parseInt(ticks) &&
            n.durationTicks === parseInt(durationTicks)
    );
}

export default function useDragHandlers(
    mode: EditMode,
    notes: ExtendedNoteJSON[],
    cellHeight: number,
    quantized: boolean,
    addNotes: (notes: ExtendedNoteJSON[]) => void,
    removeNotes: (notes: ExtendedNoteJSON[]) => void,
    setSelectedNotes: (notes: ExtendedNoteJSON[]) => void
) {
    const isDraggable = mode === "point";

    function handleDragEnd(items: DSInputElement[]) {
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

        console.log(notesFromIds);

        // Create new, relocated notes
        const notesToAdd = notesFromIds
            .filter((n) => n !== undefined)
            .map((n) =>
                deriveNewNote(
                    parseInt(transformX),
                    parseInt(transformY),
                    cellHeight,
                    n,
                    quantized
                )
            )
            .filter((n) => n !== null);

        console.log(notesToAdd);

        // Add the new notes
        addNotes(notesToAdd);
        // Set the selected notes to the new notes
        setSelectedNotes(notesToAdd);
    }

    function handleDragSelect(items: DSInputElement[]) {
        setSelectedNotes(
            items
                .map((item) => getNoteFromId(item.id, notes))
                .filter((n) => n !== undefined)
        );
    }

    return { handleDragEnd, handleDragSelect, isDraggable };
}
