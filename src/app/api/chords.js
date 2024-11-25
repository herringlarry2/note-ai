"use server";

import { NextResponse } from "next/server";

// Helper function to generate random chord progressions
function _generateChords() {
  const chords = ["C", "D", "E", "F", "G", "A", "B"];
  const qualities = ["", "m", "7", "m7", "maj7"]; // Major, minor, seventh, etc.

  let progression = [];
  for (let i = 0; i < 4; i++) {
    const root = chords[Math.floor(Math.random() * chords.length)];
    const quality = qualities[Math.floor(Math.random() * qualities.length)];
    progression.push(`${root}${quality}`);
  }

  return progression;
}

// Define the server action
export async function generateChords() {
  const progression = await _generateChords();
  return { progression };
}
