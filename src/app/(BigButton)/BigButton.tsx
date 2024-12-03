"use client";

import { useState } from "react";
import { generateBlocks, Section } from "../api/blocks";
import SectionDisplay from "./SectionDisplay";

function BigButton() {
    const [chords, setChords] = useState<Section | null>(null);
    async function onClick() {
        const section = await generateBlocks();
        setChords(section);
    }

    return (
        <div className="flex flex-col gap-4">
            <button
                className="px-6 py-3 bg-black text-white font-semibold rounded-full border border-white"
                onClick={onClick}
            >
                Click me for song
            </button>
            {chords && <SectionDisplay section={chords} />}
        </div>
    );
}

export default BigButton;
