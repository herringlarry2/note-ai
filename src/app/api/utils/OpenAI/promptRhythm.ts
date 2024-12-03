import { openai } from "./openAI";
import { Style } from "../parameters/getRandomStyle";
import { NoteValue } from "../parameters/getRandomNoteValue";
import { CHORD_EXAMPLE } from "./promptChords";
import { CHORD_FORMAT } from "./promptChords";

// Velocity Option
// 1-127 -> note with corresponding velocity
// - -> sustain note
// 0 -> rest

// Note Value (1/16 note, 1/32/ note etc.)

export type ChordEvent = {
    chord: string[] | null;
    velocity: number | null;
    duration: NoteValue[];
}

function getPrompt(noteValue: NoteValue, style: Style, chords: string[][], bars: number): string {
    return `Generate a ${bars}-bar rhythm with the following parameters: Note Value: ${noteValue}, Style: ${style}, Chords: ${chords}`;
}

const MODEL = "gpt-4o-mini";

const RHYTHM_FORMAT = `
    [
        {
            "chord": [chordNotes],     // Array of notes, or null for a rest. You may use the whole chord, a single note, or a combination of notes. Or you may invert the chord.
            "velocity": 1-127,         // Note velocity (N/A if rest)
            "duration": [noteValues]   // Array of note values for timing
        },
        // ... more midi events
    ]
`;

const RESPONSE_FORMAT = `
    {
        "rhythm": ${RHYTHM_FORMAT}
    }
`;


const RHYTHM_EXAMPLE = `
    [{"chord": ["C3", "E3", "G3", "B3"], "velocity": 127, "duration": ["16", "16]}, {"chord": null, "velocity": null, "duration": ["4"]}, {"chord": ["C3", "E3", "G3", "B3"], "velocity": 93, "duration": ["4"]}, {"chord": null, "velocity": null, "duration": ["4"]}]
`;

const SYSTEM_PROMPT = `You are assisting a music producer.

You will be given a list of chords where each chord looks like this: ${CHORD_FORMAT} i.e. ${CHORD_EXAMPLE}.

You will also be given a note value which is a string representing the duration of a note.
"1" = whole
"2" = half
"d2" = dotted half
"dd2" = double dotted half
"4" = quarter
"4t" = quarter triplet
"d4" = dotted quarter
"dd4" = double dotted quarter
"8" = eighth
"8t" = eighth triplet
"d8" = dotted eighth
"dd8" = double dotted eighth
"16" = sixteenth
"16t" = sixteenth triplet
"32" = thirty-second
"64" = sixty-fourth

You will also be given a style which is a string representing the style of music for which the generated rhythm should sound like.

Your job is to generate a musically interesting rhythmic pattern using the given chords and should add up the specified number of bars (i.e.16 quarter notes for 4 bars)

The progression should move from one chord/note to another only if it's a auditorally pleasing movement. It shoudl be compliant with other progressions of the given style.

The chord progression should make musical sense generally-speaking as well as for the given style.

Output should be in this format: ${RESPONSE_FORMAT}  with no additional characters.
`

export default async function promptRhythm(
    noteValue: NoteValue,
    style: Style,
    chords: string[][],
    bars: number
): Promise<string | null> {
    const prompt = getPrompt(noteValue, style, chords, bars);
    const completion = await openai.chat.completions.create({
        model: MODEL,
        messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 1000,
    });

    const response = completion.choices[0].message.content ?? null;

    return response;
}
