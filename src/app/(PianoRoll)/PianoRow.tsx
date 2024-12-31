import NoteCell from "./NoteCell";
import NoteLabel from "./NoteLabel";

export default function PianoRollRow({
    noteName,
    cellHeight,
    cellWidth,
    totalColumns,
    onCellClick,
}: {
    noteName: string;
    cellHeight: number;
    cellWidth: number;
    totalColumns: number;
    onCellClick: (noteName: string, colIndex: number) => void;
}) {
    return (
        <div className="relative" style={{ height: cellHeight }}>
            <NoteLabel noteName={noteName} />
            {Array.from({ length: totalColumns }).map((_, colIndex) => (
                <NoteCell
                    key={`note-cell-${noteName}-${colIndex}`}
                    noteName={noteName}
                    colIndex={colIndex}
                    cellWidth={cellWidth}
                    cellHeight={cellHeight}
                    onClick={() => onCellClick(noteName, colIndex)}
                />
            ))}
        </div>
    );
}
