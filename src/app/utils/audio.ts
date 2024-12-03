import { Midi } from "@tonejs/midi";
import { PolySynth } from "tone";

const synth = new PolySynth().toDestination();

export function playMidi(midi: Midi) {
    midi.tracks[0].notes.forEach((note) => {
        synth.triggerAttackRelease(
            note.name,
            note.duration,
            note.time,
            note.velocity
        );
    });
}
