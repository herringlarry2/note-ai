"use client";

import { useEffect, useState } from "react";
import noteClient from "../../../api/noteClient";
import { type TrackJSON } from "@tonejs/midi";
import { loadMidi } from "../utils/midi";
import { type NoteJSON } from "../types/Midi";
import { useAudio } from "../utils/audio";
import ContinuedSequence from "./ContinuedSequence";
import { PianoRoll } from "../(PianoRoll)/PianoRoll";
import { EditMode, useEditMode } from "./useEditMode";
import {
    CursorArrowRaysIcon,
    PencilIcon,
    TrashIcon,
} from "@heroicons/react/24/outline";
import useManageNotes from "./useManageNotes";


function Spinner() {
    return (
        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
    );
}


function EditModeButtons({
    mode,
    setMode,
}: {
    mode: EditMode;
    setMode: React.Dispatch<React.SetStateAction<EditMode>>;
}) {
    return (
        <div className="flex flex-row gap-2">
            <button
                className={`px-4 py-2 bg-black text-white rounded-full border border-white ${mode === "point" ? "opacity-100" : "opacity-50"}`}
                onClick={() => setMode("point")}
            >
                <CursorArrowRaysIcon className="h-6 w-6" />
            </button>
            <button
                className={`px-4 py-2 bg-black text-white rounded-full border border-white ${mode === "write" ? "opacity-100" : "opacity-50"}`}
                onClick={() => setMode("write")}
            >
                <PencilIcon className="h-6 w-6" />
            </button>
        </div>
    );
}

function BigButton() {
    const [selectedIdx, setSelectedIdx] = useState(-1);
    const [isGenerating, setIsGenerating] = useState(false);
    const [ideas, setIdeas] = useState<NoteJSON[][]>([]);
    const { playNotes } = useAudio();
    const { mode, setMode } = useEditMode();
    const { notes, addNotes, removeNotes, commitNotes, clearNotes } = useManageNotes();

    function onClear() {
        clearNotes();
    }

    async function onClickGenerate() {
        setIsGenerating(true);
        // Save the midi first until we have a better way to do this
        await noteClient.post("/api/save_track", { notes });
        const ideas = await noteClient.post<NoteJSON[][]>(
            "/api/continue_track"
        );
        setIdeas(ideas);
        setIsGenerating(false);
    }

    async function onClickPlay() {
        playNotes(notes);
    }

    async function onClickSave() {
        await noteClient.post("/api/save_track", { notes });
    }

    async function onCommitIdea() {
        await noteClient.post("/api/save_track", {
            notes: notes,
        });
        commitNotes();
        setIdeas([]);
        setSelectedIdx(-1);
    }

    return (
        <div className="flex flex-col gap-4 items-center">
            <ContinuedSequence
                ideas={ideas}
                onSelect={(idx) => {
                    // Remove current idea
                    const uncommittedNotes = notes.filter((note) => !note.committed);
                    removeNotes(uncommittedNotes);
                    // Add new idea
                    addNotes(ideas[idx].map((note) => ({ ...note, committed: false })));
                    setSelectedIdx(idx);
                }}
                selectedIdx={selectedIdx}
            />
            <PianoRoll
                width={1450}
                height={700}
                notes={notes}
                addNotes={addNotes}
                removeNotes={removeNotes}
                mode={mode}
            />

            <div className="flex flex-row gap-2 w-full justify-around">
                <EditModeButtons mode={mode} setMode={setMode} />
                <div className="flex flex-row gap-2">
                    <button
                        className="px-6 py-3 bg-black text-white font-semibold rounded-full border border-white"
                        onClick={onClickGenerate}
                    >
                        {isGenerating ? <Spinner /> : "Generate"}
                    </button>
                    <button
                        className="px-6 py-3 bg-black text-white font-semibold rounded-full border border-white"
                        onClick={onClickPlay}
                    >
                        Play
                    </button>
                    <button
                        className="px-6 py-3 bg-black text-white font-semibold rounded-full border border-white"
                        onClick={onClickSave}
                    >
                        Save
                    </button>
                    <button
                        className="px-6 py-3 bg-black text-white font-semibold rounded-full border border-white"
                        onClick={onClear}
                    >
                        Clear
                    </button>
                    <button
                        className="px-6 py-3 bg-black text-white font-semibold rounded-full border border-white"
                        onClick={onCommitIdea}
                    >
                        Commit
                    </button>
                </div>
            </div>
        </div>
    );
}

export default BigButton;
