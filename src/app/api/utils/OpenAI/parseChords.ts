export default function parseChords(response: string): string[][] {
    try {
        return JSON.parse(response).chords;
    } catch (error) {
        console.error(error);
        console.log(response);
        throw error;
    }
}
