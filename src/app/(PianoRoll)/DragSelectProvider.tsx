import React, { createContext, useState, useEffect, useContext } from "react";
import DragSelect, { DSInputElement } from "dragselect";

type ProviderProps = {
    children: React.ReactNode;
    settings?: ConstructorParameters<typeof DragSelect<DSInputElement>>[0];
    updateNotes: (data: {
        items: DSInputElement[];
        event?: MouseEvent | TouchEvent | null | undefined | KeyboardEvent;
    }) => void;
};

const Context = createContext<DragSelect<DSInputElement> | undefined>(
    undefined
);

function DragSelectProvider({
    children,
    settings = {},
    updateNotes,
}: ProviderProps) {
    const [ds, setDS] = useState<DragSelect<DSInputElement>>();

    useEffect(() => {
        setDS((prevState) => {
            if (prevState) return prevState;
            return new DragSelect({});
        });
        return () => {
            if (ds) {
                ds.stop();
                setDS(undefined);
            }
        };
    }, [ds]);

    useEffect(() => {
        if (ds) {
            ds.setSettings(settings);
        }
    }, [ds, settings]);

    useEffect(() => {
        if (ds) {
            ds.subscribe("DS:end", ({ items, event, isDragging }) => {
                if (isDragging) {
                    updateNotes({ items, event });
                }
            });
        }
    }, [ds, updateNotes]);

    return <Context.Provider value={ds}>{children}</Context.Provider>;
}

function useDragSelect() {
    return useContext(Context);
}

export { DragSelectProvider, useDragSelect };
