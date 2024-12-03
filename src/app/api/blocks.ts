"use server";

import MidiWriter from "midi-writer-js";

import getRandomKey, { SongKey } from "./utils/parameters/getRandomKey";
import getRandomMode, { SongMode } from "./utils/parameters/getRandomMode";
import getRandomStartingNote, {
    SongNote,
} from "./utils/parameters/getRandomStartingNote";
import getRandomStyle, { Style } from "./utils/parameters/getRandomStyle";
import promptChords from "./utils/OpenAI/promptChords";
import { uploadS3 } from "./utils/AWS/uploadS3";
import createMidiTrack from "./utils/Midi/createMidiTrack";
import { signS3 } from "./utils/AWS/signS3";
import { getRandomNoteValue } from "./utils/parameters/getRandomNoteValue";
import promptRhythm from "./utils/OpenAI/promptRhythm";
import parseRhythm from "./utils/OpenAI/parseRhythm";
import parseChords from "./utils/OpenAI/parseChords";

const BARS = 4;

export type Section = {
    key: SongKey;
    mode: SongMode;
    startingNote: SongNote;
    style: Style;
    chords: string[][];
    signedUrl: string;
};

async function _generateBlocks() {
    const key = getRandomKey();
    const mode = getRandomMode();
    const startingNote = getRandomStartingNote();
    const style = getRandomStyle();

    const chordsResponse = await promptChords(key, mode, startingNote, style);
    if (!chordsResponse) {
        return null;
    }

    const chords = parseChords(chordsResponse);

    const noteValue = getRandomNoteValue();
    const rhythmResponse = await promptRhythm(noteValue, style, chords, BARS);
    if (!rhythmResponse) {
        return null;
    }
    const chordEvents = parseRhythm(rhythmResponse);


    const midi = createMidiTrack(chordEvents);
    const writer = new MidiWriter.Writer(midi);
    await uploadS3(writer.buildFile(), "midi.mid");
    const signedUrl = await signS3("midi.mid");

    return { key, mode, startingNote, style, chords, signedUrl };
}

// Define the server action
export async function generateBlocks() {
    const progression = await _generateBlocks();
    return progression;
}
