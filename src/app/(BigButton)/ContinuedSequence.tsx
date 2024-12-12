import { NoteJSON } from "../types/Midi";
import { Dispatch, SetStateAction } from "react";


function ContinuedSequenceItem({name, idea, setIdea}: {name: number, idea: NoteJSON[], setIdea: (idea: NoteJSON[]) => void}) {
    return (
        <button 
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 shadow-md"
            onClick={() => {setIdea(idea)}}
        >
            {name}
        </button>
    )
}


export default function ContinuedSequence({ideas, setCurrentIdea}: {ideas: NoteJSON[][], setCurrentIdea: Dispatch<SetStateAction<NoteJSON[] | null>>}) {
    return <div>
        {ideas.map((idea, index) => <ContinuedSequenceItem key={index} name={index} idea={idea} setIdea={() => setCurrentIdea(idea)} />)}
    </div>
}