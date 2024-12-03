export type NoteValue =
    | "1" // whole
    | "2" // half
    | "d2"  // dotted half
    | "dd2" // double dotted half
    | "4" // quarter
    | "4t" // quarter triplet
    | "d4" // dotted quarter
    | "dd4" // double dotted quarter
    | "8" // eighth
    | "8t" // eighth triplet
    | "d8" // dotted eighth
    | "dd8" // double dotted eighth
    | "16" // sixteenth
    | "16t" // sixteenth triplet
    | "32" // thirty-second
    | "64"; // sixty-fourth

export function getRandomNoteValue(): NoteValue {
    const noteValues: NoteValue[] = ["8", "16"];
    return noteValues[Math.floor(Math.random() * noteValues.length)];
}
