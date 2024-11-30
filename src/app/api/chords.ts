"use server";

import getRandomKey from "./utils/parameters/getRandomKey";
import getRandomMode from "./utils/parameters/getRandomMode";
import getRandomStartingNote from "./utils/parameters/getRandomStartingNote";
import getRandomStyle from "./utils/parameters/getRandomStyle";
import prompt from "./utils/OpenAI/prompt";

// Helper function to generate random chord progressions
async function _generateChords() {
  const key = getRandomKey();
  const mode = getRandomMode();
  const startingNote = getRandomStartingNote();
  const style = getRandomStyle();

  const response = await prompt(key, mode, startingNote, style);

  return { key, mode, startingNote, style };
}

// Define the server action
export async function generateChords() {
  const progression = await _generateChords();
  return progression 
}
