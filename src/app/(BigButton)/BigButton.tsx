"use client";

import { useEffect, useState } from "react";
import noteClient from "../../../api/noteClient";
import { type TrackJSON } from "@tonejs/midi";
import { loadMidi } from "../utils/midi";
import { type NoteJSON } from "../types/Midi";
import { useAudio } from "../utils/audio";
import ContinuedSequence from "./ContinuedSequence";
import { PianoRoll } from "../(PianoRoll)/PianoRoll";
import { EditMode, useEditMode } from "./useEditMode";
import {
    CursorArrowRaysIcon,
    PencilIcon,
    TrashIcon,
} from "@heroicons/react/24/outline";
import saveTrack from "../api/saveTrack";

function useMidiNotes(
    currentIdea: NoteJSON[] | null,
    originalMidiNotes: NoteJSON[] | null
) {
    const [midiNotes, setMidiNotes] = useState<NoteJSON[]>([]);

    useEffect(() => {
        if (currentIdea || originalMidiNotes) {
            setMidiNotes([
                ...(currentIdea ?? []),
                ...(originalMidiNotes ?? []),
            ]);
        }
    }, [currentIdea, originalMidiNotes]);

    return { midiNotes, setMidiNotes };
}

function Spinner() {
    return (
        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
    );
}

function isSameNote(note1: NoteJSON, note2: NoteJSON) {
    return note1.name === note2.name && note1.durationTicks === note2.durationTicks && note1.ticks === note2.ticks && note1.velocity === note2.velocity && note1.name === note2.name;
}

function useCurrentNotes() {
    const [notes, setNotes] = useState<AnnotatedNoteJSON[]>([]);

    function _setNotes(newNotes: AnnotatedNoteJSON[] | NoteJSON[], status: NoteStatus) {
        setNotes(newNotes.map(note => ({
            ...note,
            status,
        })));
    }

    function addNotes(newNotes: AnnotatedNoteJSON[] | NoteJSON[], status?: NoteStatus) {
        setNotes(prev => [...prev, ...newNotes.map(note => ({
            ...note,
            status: status ?? ('status' in note ? note.status : 'candidate'),
        }))]);
    }

    function removeNotes(notes: AnnotatedNoteJSON[]) {
        setNotes(prev => prev.filter(note => !notes.some(n => isSameNote(note, n))));
    }

    useEffect(() => {
        async function fetchTrack() {
            const { signedUrl } = await noteClient.get<{ signedUrl: string }>(
                "/api/sign_s3"
            );
            const midi = await loadMidi(signedUrl);
            if (midi.tracks.length > 0) {
                _setNotes(midi.tracks[0].notes, "committed");
            }
        }
        fetchTrack();
    }, []);

    // Status doesn't matter in clearNotes but since we're hiding the confusion behind an abstraction I'll just leave it.
    return { notes, setNotes: _setNotes, addNotes, removeNotes, clearNotes: () => _setNotes([], "candidate") };
}

function EditModeButtons({
    mode,
    setMode,
}: {
    mode: EditMode;
    setMode: React.Dispatch<React.SetStateAction<EditMode>>;
}) {
    return (
        <div className="flex flex-row gap-2">
            <button
                className={`px-4 py-2 bg-black text-white rounded-full border border-white ${mode === "point" ? "opacity-100" : "opacity-50"}`}
                onClick={() => setMode("point")}
            >
                <CursorArrowRaysIcon className="h-6 w-6" />
            </button>
            <button
                className={`px-4 py-2 bg-black text-white rounded-full border border-white ${mode === "write" ? "opacity-100" : "opacity-50"}`}
                onClick={() => setMode("write")}
            >
                <PencilIcon className="h-6 w-6" />
            </button>
        </div>
    );
}

type NoteStatus = "committed" | "candidate";

type AnnotatedNoteJSON = NoteJSON & {
    status: NoteStatus;
};


function BigButton() {
    const [selectedIdx, setSelectedIdx] = useState(-1);
    const [isGenerating, setIsGenerating] = useState(false);
    // I think that ultimately we just just use the tonejs midi format but for now
    // I just want to see that it works so we'll massage temp into that format
    const [ideas, setIdeas] = useState<NoteJSON[][]>([]);


    const { playNotes } = useAudio();
    const { mode, setMode } = useEditMode();
    const { notes, setNotes, addNotes, clearNotes, removeNotes } = useCurrentNotes();

    function onClear() {
        clearNotes();
    }

    async function onClickGenerate() {
        setIsGenerating(true);
        // Save the midi first until we have a better way to do this
        await saveTrack(notes);
        const ideas = await noteClient.post<NoteJSON[][]>(
            "/api/continue_track"
        );
        setIdeas(ideas);
        setIsGenerating(false);
    }

    async function onClickPlay() {
        playNotes(notes);
    }

    async function onClickSave() {
        await saveTrack(notes);
    }

    async function onCommitIdea() {
        const isSaved = await saveTrack(notes);
        if (isSaved) {
            // todo(will) Update set notes to accept a callback
            setNotes(notes, "committed");
        }
    }


    return (
        <div className="flex flex-col gap-4 items-center">
            <ContinuedSequence
                ideas={ideas}
                onSelect={(idx) => {
                    addNotes(ideas[idx], "candidate");
                    setSelectedIdx(idx);
                }}
                selectedIdx={selectedIdx}
            />
            <PianoRoll
                width={1450}
                height={700}
                notes={notes}
                addNotes={addNotes}
                removeNotes={removeNotes}
                mode={mode}
            />

            <div className="flex flex-row gap-2 w-full justify-around">
                <EditModeButtons mode={mode} setMode={setMode} />
                <div className="flex flex-row gap-2">
                    <button
                        className="px-6 py-3 bg-black text-white font-semibold rounded-full border border-white"
                        onClick={onClickGenerate}
                    >
                        {isGenerating ? <Spinner /> : "Generate"}
                    </button>
                    <button
                        className="px-6 py-3 bg-black text-white font-semibold rounded-full border border-white"
                        onClick={onClickPlay}
                    >
                        Play
                    </button>
                    <button
                        className="px-6 py-3 bg-black text-white font-semibold rounded-full border border-white"
                        onClick={onClickSave}
                    >
                        Save
                    </button>
                    <button
                        className="px-6 py-3 bg-black text-white font-semibold rounded-full border border-white"
                        onClick={onClear}
                    >
                        Clear
                    </button>
                    <button
                        className="px-6 py-3 bg-black text-white font-semibold rounded-full border border-white"
                        onClick={onCommitIdea}
                    >
                        Commit
                    </button>
                </div>
            </div>
        </div>
    );
}

export default BigButton;
