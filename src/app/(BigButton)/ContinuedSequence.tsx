import { NoteJSON } from "../types/Midi";
import { Dispatch, SetStateAction } from "react";

function ContinuedSequenceItem({
    name,
    idea,
    onSelect,
    selected,
}: {
    name: number;
    idea: NoteJSON[];
    onSelect: () => void;
    selected: boolean;
}) {
    return (
        <button
            className={`px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors duration-200 shadow-md border border-white ${selected ? "bg-zinc-900" : ""}`}
            onClick={onSelect}
        >
            {name}
        </button>
    );
}

export default function ContinuedSequence({
    ideas,
    onSelect,
    selectedIdx,
}: {
    ideas: NoteJSON[][];
    onSelect: (idx: number) => void;
    selectedIdx: number;
}) {
    return (
        <div className="flex flex-row gap-2">
            {ideas.map((idea, index) => (
                <ContinuedSequenceItem
                    key={index}
                    selected={selectedIdx === index}
                    name={index}
                    idea={idea}
                    onSelect={() => onSelect(index)}
                />
            ))}
        </div>
    );
}
