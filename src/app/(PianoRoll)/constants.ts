export const TICKS_PER_16TH = 60;
export const NOTE_NAMES = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
];
export const OCTAVES = [0, 1, 2, 3, 4, 5, 6, 7, 8];
export const ALL_NOTES = OCTAVES.map((octave) =>
    NOTE_NAMES.map((note) => `${note}${octave}`)
)
    .flat()
    .reverse();
