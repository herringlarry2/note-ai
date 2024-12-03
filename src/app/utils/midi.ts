import { Midi } from "@tonejs/midi";

export async function loadMidi(midiUrl: string): Promise<Midi> {
    const midi = await Midi.fromUrl(midiUrl);
    return midi;
}
