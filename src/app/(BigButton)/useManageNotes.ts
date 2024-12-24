import { useState, useEffect } from "react";
import { NoteJSON } from "../types/Midi";
import { loadMidi } from "../utils/midi";
import noteClient from "../../../api/noteClient";

type ExtendedNoteJSON = NoteJSON & { committed: boolean };

function useCurrentTrack() {

}

export default function useMidiNotes(
) {
    const [notes, setNotes] = useState<ExtendedNoteJSON[]>([]);

    function addNotes(newNotes: ExtendedNoteJSON[]) {
        setNotes(prev => [...prev, ...newNotes]);
    }

    function removeNotes(notes: ExtendedNoteJSON[]) {
        setNotes(prev => prev.filter(note => !notes.includes(note)));
    }

    function commitNotes() {
        setNotes(prev => prev.map(note => ({
            ...note,
            committed: true,
        })));
    }

    useEffect(() => {
        async function fetchTrack() {
            const { signedUrl } = await noteClient.get<{ signedUrl: string }>(
                "/api/sign_s3"
            );
            const midi = await loadMidi(signedUrl);
            if (midi.tracks.length > 0) {
                const extendedNotes = midi.tracks[0].notes.map((note) => ({
                    ...note,
                    committed: true,
                }));
                setNotes(extendedNotes);
            }
        }
        fetchTrack();
    }, []);

    return { notes, addNotes, removeNotes, commitNotes };

}