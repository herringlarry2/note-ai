import { NoteJSON } from "../types/Midi";
import { Dispatch, SetStateAction } from "react";

function ContinuedSequenceItem({
    name,
    idea,
    setIdea,
    selected,
}: {
    name: number;
    idea: NoteJSON[];
    setIdea: (idea: NoteJSON[]) => void;
    selected: boolean;
}) {
    return (
        <button
            className={`px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors duration-200 shadow-md border border-white ${selected ? "bg-zinc-900" : ""}`}
            onClick={() => {
                setIdea(idea);
            }}
        >
            {name}
        </button>
    );
}

export default function ContinuedSequence({
    ideas,
    setCurrentIdea,
    currentIdea,
}: {
    ideas: NoteJSON[][];
    currentIdea: NoteJSON[] | null;
    setCurrentIdea: Dispatch<SetStateAction<NoteJSON[] | null>>;
}) {
    return (
        <div className="flex flex-row gap-2">
            {ideas.map((idea, index) => (
                <ContinuedSequenceItem
                    key={index}
                    selected={currentIdea === idea}
                    name={index}
                    idea={idea}
                    setIdea={() => setCurrentIdea(idea)}
                />
            ))}
        </div>
    );
}
