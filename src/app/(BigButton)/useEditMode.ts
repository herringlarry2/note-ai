import { useState } from "react";

export type EditMode = "point" | "write";

export function useEditMode() {
    const [mode, setMode] = useState<EditMode>("point");

    return { mode, setMode };
}
