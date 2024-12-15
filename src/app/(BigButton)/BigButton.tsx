"use client";

import { useEffect, useState } from "react";
import noteClient from "../../../api/noteClient";
import { type TrackJSON } from "@tonejs/midi";
import { loadMidi } from "../utils/midi";
import { type NoteJSON } from "../types/Midi";
import { useAudio } from "../utils/audio";
import ContinuedSequence from "./ContinuedSequence";
import { PianoRoll } from "../(PianoRoll)/PianoRoll";


function useMidiNotes(currentIdea: NoteJSON[] | null, originalMidiNotes: NoteJSON[] | null) {
    const [midiNotes, setMidiNotes] = useState<NoteJSON[]>([]);

    useEffect(() => {
        if (currentIdea || originalMidiNotes) {
            setMidiNotes([...(currentIdea ?? []), ...(originalMidiNotes ?? [])]);
        }
    }, [currentIdea, originalMidiNotes]);

    return {midiNotes, setMidiNotes};
}

function useFetchTracks() {
    const [tracks, setTracks] = useState<TrackJSON[]>([]);

    useEffect(() => {
        async function fetchTrack() {
            console.log("Fetching track");
            const {signedUrl} = await noteClient.get<{signedUrl: string}>("/api/sign_s3");
            const midi = await loadMidi(signedUrl);
            setTracks(midi.tracks);
        }
        fetchTrack();
    }, []);

    return tracks;
}

function BigButton() {
    // I think that ultimately we just just use the tonejs midi format but for now
    // I just want to see that it works so we'll massage temp into that format
    const [ideas, setIdeas] = useState<NoteJSON[][]>([]);
    const {playNotes} = useAudio();

    const tracks = useFetchTracks()


    const [currentIdea, setCurrentIdea] = useState<NoteJSON[] | null>(null);

    const {midiNotes, setMidiNotes} = useMidiNotes(currentIdea, tracks?.[0]?.notes);

    function onClear() {
        setMidiNotes([]);
    }

    console.log(midiNotes);

    async function onClickGenerate() {
        const ideas = await noteClient.post<NoteJSON[][]>("/api/continue_track");
        setIdeas(ideas);
    }


    async function onClickPlay() {
        playNotes(midiNotes);
    }

    async function onClickSave() {
        await noteClient.post("/api/save_track", {notes: midiNotes});
    }


    return (
        <div className="flex flex-col gap-4">
            <button
                className="px-6 py-3 bg-black text-white font-semibold rounded-full border border-white"
                onClick={onClickGenerate}
            >
                Click me for song
            </button>
            <button
                className="px-6 py-3 bg-black text-white font-semibold rounded-full border border-white"
                onClick={onClickPlay}
            >
                Play current idea
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
            <ContinuedSequence ideas={ideas} setCurrentIdea={setCurrentIdea} />
            <PianoRoll width={1250} height={500} notes={midiNotes} setNotes={setMidiNotes} />
        </div>
    );
}

export default BigButton;
