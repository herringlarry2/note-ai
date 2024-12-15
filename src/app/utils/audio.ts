"use client";

import { getTransport, PolySynth, Context, Ticks } from "tone";
import { NoteJSON } from "../types/Midi";
import { useEffect, useRef } from "react";


function convertTicksToSeconds(ticks: number) {
    return Ticks(ticks).toSeconds();
}

async function playNotes(notes: NoteJSON[], synth: PolySynth) {
    synth.releaseAll();
    getTransport().stop();
    getTransport().cancel(0);


    notes.forEach((note, idx) => {
        const durationSeconds = convertTicksToSeconds(note.durationTicks) / 2;
        const startTimeSeconds = convertTicksToSeconds(note.ticks) / 4;
        getTransport().scheduleOnce((time) => {
            synth.triggerAttackRelease(
                note.name,
                durationSeconds, 
                time + startTimeSeconds, 
                note.velocity
            );
        }, startTimeSeconds);
    });

    getTransport().start();
    
}




export function useAudio() {
    const synth = useRef<PolySynth>();

    useEffect(() => {
        const localSynth = new PolySynth({maxPolyphony: 100}).toDestination();
        synth.current = localSynth;
    }, [])

    return {playNotes: (notes: NoteJSON[]) => synth.current && playNotes(notes, synth.current)};
}


