export type SongMode = 'major' | 'minor'

export default function getRandomMode(): SongMode {
    const modes: SongMode[] = ['major', 'minor']
    return modes[Math.floor(Math.random() * modes.length)]
}
