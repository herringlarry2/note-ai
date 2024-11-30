"use client";

import { useState } from "react";
import Chords from "./Chords";
import { generateChords } from "../api/chords";

function BigButton() {
  const [chords, setChords] = useState<string[]>([]);
  async function onClick() {
    const response = await generateChords();
    setChords([]);
  }

  return (
    <div className="flex flex-col gap-4">
      <button
        className="px-6 py-3 bg-black text-white font-semibold rounded-full border border-white"
        onClick={onClick}
      >
        Click me for song
      </button>
      {chords.length > 0 && <Chords chords={chords} />}
    </div>
  );
}

export default BigButton;
