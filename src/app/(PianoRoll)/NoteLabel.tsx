export default function NoteLabel({ noteName }: { noteName: string }) {
    return (
        <div
            className="absolute left-0 top-0 w-12 h-full flex items-center justify-center text-xs text-zinc-400 border-r border-zinc-700 bg-zinc-900"
            style={{
                position: "sticky",
                left: 0,
                zIndex: 1,
                userSelect: "none",
            }}
        >
            {noteName}
        </div>
    );
}
