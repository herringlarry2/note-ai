import { useEffect, useState } from "react";
import { type Section } from "../api/chords";
import * as Tone from 'tone';
import { loadMidi } from "../utils/midi";
import { playMidi } from "../utils/audio";





function SectionDisplay({ section }: { section: Section }) {
  const [fileContent, setFileContent] = useState<string | null>(null);

  useEffect(() => {
    const loadFile = async () => {
      try {
        const response = await fetch(section.signedUrl);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.text(); // or response.json() if it's a JSON file
        setFileContent(data);
      } catch (error) {
        console.error('Error fetching the file:', error);
      }
    };

    loadFile();
  }, [section.signedUrl]);

  async function play() {
    if (!fileContent) return;

    const midi = await loadMidi(section.signedUrl);
    
    playMidi(midi);
  }


  return (
    <div className="flex flex-col gap-4">
      <button className="bg-blue-500 text-white p-2 rounded-md" onClick={play}>Play Chords</button>
      {/* {section.chords.map((chord, idx) => (
        <div key={`${idx}-${chord}`}>{chord}</div>
      ))} */}
    </div>
  );
}

export default SectionDisplay;
