import { type MidiJSON } from "@tonejs/midi";

export type TrackJSON = MidiJSON["tracks"][number];
export type NoteJSON = TrackJSON["notes"][number];

export type CompactNoteJSON = Omit<NoteJSON, "time" | "midi" | "duration">;

export type NoteStatus = "committed" | "candidate";

export type AnnotatedNoteJSON = NoteJSON & {
    status: NoteStatus;
};
