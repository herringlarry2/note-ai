"use server";

import MidiWriter from 'midi-writer-js';

import getRandomKey from "./utils/parameters/getRandomKey";
import getRandomMode from "./utils/parameters/getRandomMode";
import getRandomStartingNote from "./utils/parameters/getRandomStartingNote";
import getRandomStyle from "./utils/parameters/getRandomStyle";
import prompt from "./utils/OpenAI/prompt";
import { uploadS3 } from "./utils/AWS/uploadS3";
import createMidiTrack from "./utils/Midi/createMidiTrack";
import parseResponse from "./utils/OpenAI/parse";
import { signS3 } from './utils/AWS/signS3';

async function _generateChords() {
  const key = getRandomKey();
  const mode = getRandomMode();
  const startingNote = getRandomStartingNote();
  const style = getRandomStyle();

  const response = await prompt(key, mode, startingNote, style);
  if (!response) {
    return null;
  }

  const chords = parseResponse(response);

  const midi = createMidiTrack(chords);
  const writer = new MidiWriter.Writer(midi);
  await uploadS3(writer.buildFile(), "midi.mid");
  const signedUrl = await signS3("midi.mid");

  return { key, mode, startingNote, style, chords, signedUrl};
}

// Define the server action
export async function generateChords() {
  const progression = await _generateChords();
  return progression 
}
