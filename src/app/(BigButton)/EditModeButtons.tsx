import { EditMode } from "./useEditMode";

import {
    CursorArrowRaysIcon,
    PencilIcon,
} from "@heroicons/react/24/outline";

export default function EditModeButtons({
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