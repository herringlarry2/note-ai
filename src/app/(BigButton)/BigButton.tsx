"use client";

import { useEffect, useState } from "react";
import noteClient from "../../../api/noteClient";
import { type TrackJSON } from "@tonejs/midi";
import { loadMidi } from "../utils/midi";
import { type NoteJSON } from "../types/Midi";
import { useAudio } from "../utils/audio";
import ContinuedSequence from "./ContinuedSequence";
import { PianoRoll } from "../(PianoRoll)/PianoRoll";

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

function useCurrentTrack() {
    const [notes, setNotes] = useState<NoteJSON[]>([]);

    useEffect(() => {
        async function fetchTrack() {
            const { signedUrl } = await noteClient.get<{ signedUrl: string }>(
                "/api/sign_s3"
            );
            const midi = await loadMidi(signedUrl);
            if (midi.tracks.length > 0) {
                setNotes(midi.tracks[0].notes);
            }
        }
        fetchTrack();
    }, []);

    return { notes, setNotes };
}

function BigButton() {
    const [selectedIdx, setSelectedIdx] = useState(-1);
    const [isGenerating, setIsGenerating] = useState(false);
    // I think that ultimately we just just use the tonejs midi format but for now
    // I just want to see that it works so we'll massage temp into that format
    const [ideas, setIdeas] = useState<NoteJSON[][]>([]);
    const { playNotes } = useAudio();

    const { notes, setNotes } = useCurrentTrack();
    const [currentIdea, setCurrentIdea] = useState<NoteJSON[] | null>(null);

    function onClear() {
        setNotes([]);
    }

    async function onClickGenerate() {
        setIsGenerating(true);
        // Save the midi first until we have a better way to do this
        await noteClient.post("/api/save_track", { notes });
        const ideas = await noteClient.post<NoteJSON[][]>(
            "/api/continue_track"
        );
        setIdeas(ideas);
        setIsGenerating(false);
    }

    async function onClickPlay() {
        const aggregatedNotes = [...notes, ...(currentIdea ?? [])];
        playNotes(aggregatedNotes);
    }

    async function onClickSave() {
        await noteClient.post("/api/save_track", { notes });
    }

    async function onCommitIdea() {
        if (currentIdea) {
            const _aggregatedNotes = [...notes, ...currentIdea];
            await noteClient.post("/api/save_track", {
                notes: _aggregatedNotes,
            });
            setNotes(_aggregatedNotes);
            setCurrentIdea(null);
            setIdeas([]);
            setSelectedIdx(-1);
        }
    }

    return (
        <div className="flex flex-col gap-4 items-center">
            <ContinuedSequence
                ideas={ideas}
                onSelect={(idx) => {
                    setCurrentIdea(ideas[idx]);
                    setSelectedIdx(idx);
                }}
                selectedIdx={selectedIdx}
            />
            <PianoRoll
                width={1450}
                height={700}
                incumbentNotes={notes}
                candidateNotes={currentIdea ?? []}
                setNotes={setNotes}
            />
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
    );
}

export default BigButton;
