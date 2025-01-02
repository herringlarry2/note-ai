import { isBlackKey } from "./utils";

interface NoteCellProps {
    noteName: string;
    colIndex: number;
    cellWidth: number;
    cellHeight: number;
    onClick: () => void;
    isBarLine?: boolean;
}

export default function NoteCell({
    noteName,
    colIndex,
    cellWidth,
    cellHeight,
    onClick,
    isBarLine,
}: NoteCellProps) {
    return (
        <div
            className={`absolute border-r border-b border-zinc-700/50
                                    ${
                                        !isBlackKey(noteName)
                                            ? "bg-zinc-900 hover:bg-zinc-800"
                                            : "bg-zinc-950 hover:bg-zinc-900"
                                    }
                                    transition-colors cursor-pointer
                                    ${isBarLine ? "border-r-2" : "border-r-[1px]"}
                                `}
            style={{
                top: 0,
                left: colIndex * cellWidth + 48, // Add 48px for labels
                width: cellWidth,
                height: cellHeight,
            }}
            onClick={onClick}
        />
    );
}
