"use client";

import { useEffect, useState } from "react";
import noteClient from "../../../api/noteClient";
import { type TrackJSON } from "@tonejs/midi";
import { loadMidi } from "../utils/midi";
import { type NoteJSON } from "../types/Midi";
import { useAudio } from "../utils/audio";
import ContinuedSequence from "./ContinuedSequence";


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

    async function onClickGenerate() {
        const ideas = await noteClient.post<NoteJSON[][]>("/api/continue_track");
        setIdeas(ideas);
    }

    async function onClickPlay() {
        const appendNotes = currentIdea ? currentIdea : [];
        const currNotes = tracks?.[0].notes;
        playNotes([...currNotes, ...appendNotes]);
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
            <ContinuedSequence ideas={ideas} setCurrentIdea={setCurrentIdea} />
        </div>
    );
}

export default BigButton;
