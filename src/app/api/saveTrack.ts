import noteClient from "../../../api/noteClient";
import { AnnotatedNoteJSON, NoteJSON } from "../types/Midi";

export default async function saveTrack(notes: AnnotatedNoteJSON[]) {
    // Get rid of annotation
    const cleanedNotes = notes.map(({ status, ...rest }) => rest);
    const isSaved = await noteClient.post<boolean>("/api/save_track", {
        notes: cleanedNotes
    });
    return isSaved;
}