import noteClient from "../../../api/noteClient";
import { AnnotatedNoteJSON, NoteJSON } from "../types/Midi";

export default async function saveTrack(notes: AnnotatedNoteJSON[]) {
    const isSaved = await noteClient.post<boolean>("/api/save_track", {
        notes,
    });
    return isSaved;
}