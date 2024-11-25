function Chords({ chords }: { chords: string[] }) {
  return (
    <div className="flex flex-col gap-4">
      {chords.map((chord, idx) => (
        <div key={`${idx}-${chord}`}>{chord}</div>
      ))}
    </div>
  );
}

export default Chords;
