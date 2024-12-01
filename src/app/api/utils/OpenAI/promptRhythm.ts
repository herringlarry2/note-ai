import createMidi from '../Midi/createMidiTrack'
import parseResponse from './parse'
import fs from 'fs'
import MidiWriter from 'midi-writer-js'
import { uploadS3 } from '../AWS/uploadS3'
import { openai } from './openAI'

// Articulation Option
// 1-127 -> note with corresponding velocity
// - -> sustain note
// 0 -> rest

// Note Value (1/16 note, 1/32/ note etc.)
// genre: rock, pop, hip-hop, etc.


function getPrompt(
    key: string,
    mode: string,
    startingNote: string,
    style: string
): string {
    return `Generate a 4-bar chord progression with the following parameters: Key: ${key}, Mode: ${mode}, Starting Note: ${startingNote}, Style: ${style}`
}

const MODEL = 'gpt-4o-mini'

const RESPONSE_FORMAT = `
    {
        "rhythm": [
            articulation1,
            articulation2,
            articulation3,
            articulation4
        ]
    }
`

const RHYTHM_FORMAT = `
    [articulation1, articulation2, articulation3, articulation4]
`

const RHYTHM_EXAMPLE = `
    [127, 93, -, -, 127, 93, -, -]
`

const SYSTEM_PROMPT = `You are assisting a music producer. Your job is to take the given prompt and generate a response of the format: ${RESPONSE_FORMAT} where each chord is an array of notes lowest to highest: ${RHYTHM_EXAMPLE} i.e. ${RHYTHM_EXAMPLE}. Please do not include any other text in your response.`

export default async function promptRhythm(
    key: string,
    mode: string,
    startingNote: string,
    style: string
): Promise<string | null> {
    const prompt = getPrompt(key, mode, startingNote, style)
    const completion = await openai.chat.completions.create({
        model: MODEL,
        messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 100,
    })

    const response = completion.choices[0].message.content ?? null
    return response
}
