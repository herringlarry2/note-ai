import MidiWriter from 'midi-writer-js';
import { Track } from 'midi-writer-js/build/types/chunks/track';

const DURATION = "1"

function addChord(track: Track, chord: string[], index: number) {
    const noteEvent = new MidiWriter.NoteEvent({
        pitch: chord,
        duration: DURATION

    });
    track.addEvent(noteEvent);
}

export default function createMidiTrack(chords: string[][]): Track {
    const track = new MidiWriter.Track();

    chords.forEach((chord, index) => {
        addChord(track, chord, index);
    });

    return track; 
}
