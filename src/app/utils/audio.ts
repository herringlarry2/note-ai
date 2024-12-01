import { Midi } from '@tonejs/midi'
import { PolySynth } from 'tone'

export function playMidi(midi: Midi) {
    const synth = new PolySynth().toDestination()
    midi.tracks[0].notes.forEach((note) => {
        synth.triggerAttackRelease(note.name, note.duration, note.time)
    })
}
