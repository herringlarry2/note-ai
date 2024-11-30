type SongNote = "i" | "ii" | "iii" | "iv" | "v" | "vi" | "vii";

function getWeightedRandomIndex(weights: number[]): number {
    // Generate a random number between 0 and 1
    const random = Math.random();
    let sum = 0;
    for (let i = 0; i < weights.length; i++) {
        sum += weights[i];
        if (random < sum) return i;
    }
    return weights.length - 1;
}

export default function getRandomStartingNote(): SongNote {
    const notes: SongNote[] = ["i", "ii", "iii", "iv", "v", "vi", "vii"];
    const weights = [0.4, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1];
    return notes[getWeightedRandomIndex(weights)];
}
