export default function parseResponse(response: string): string[][] {
    return JSON.parse(response).chords;
}
