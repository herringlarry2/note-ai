'use server'

import MidiWriter from 'midi-writer-js'

import getRandomKey, { SongKey } from './utils/parameters/getRandomKey'
import getRandomMode, { SongMode } from './utils/parameters/getRandomMode'
import getRandomStartingNote, {
    SongNote,
} from './utils/parameters/getRandomStartingNote'
import getRandomStyle, { Style } from './utils/parameters/getRandomStyle'
import promptChords from './utils/OpenAI/promptChords'
import { uploadS3 } from './utils/AWS/uploadS3'
import createMidiTrack from './utils/Midi/createMidiTrack'
import parseResponse from './utils/OpenAI/parse'
import { signS3 } from './utils/AWS/signS3'

export type Section = {
    key: SongKey
    mode: SongMode
    startingNote: SongNote
    style: Style
    chords: string[][]
    signedUrl: string
}

async function _generateBlocks() {
    const key = getRandomKey()
    const mode = getRandomMode()
    const startingNote = getRandomStartingNote()
    const style = getRandomStyle()

    const response = await promptChords(key, mode, startingNote, style)
    if (!response) {
        return null
    }

    const chords = parseResponse(response)

    const midi = createMidiTrack(chords)
    const writer = new MidiWriter.Writer(midi)
    await uploadS3(writer.buildFile(), 'midi.mid')
    const signedUrl = await signS3('midi.mid')

    return { key, mode, startingNote, style, chords, signedUrl }
}

// Define the server action
export async function generateBlocks() {
    const progression = await _generateBlocks()
    return progression
}
