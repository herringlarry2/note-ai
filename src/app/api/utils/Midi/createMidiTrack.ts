import MidiWriter from "midi-writer-js";
import { Track } from "midi-writer-js/build/types/chunks/track";
import { NoteValue } from "../parameters/getRandomNoteValue";
import { ChordEvent } from "../OpenAI/promptRhythm";


    
function writeChordEvents(
    track: Track,
    chordEvents: ChordEvent[]
) {
    let waitFor: NoteValue[] = [];


    chordEvents.forEach((chordEvent) => {
        if (chordEvent.chord) {
            track.addEvent(new MidiWriter.NoteEvent({
                pitch: chordEvent.chord,
                velocity: chordEvent.velocity,
                wait: waitFor,
                duration: chordEvent.duration,
            }))
            waitFor = [];
        } else {
           waitFor.push(...chordEvent.duration);
        }
    })
}

export default function createMidiTrack(
    chordEvents: ChordEvent[]
): Track {
    const track = new MidiWriter.Track();

    writeChordEvents(track, chordEvents);
    return track;
}
