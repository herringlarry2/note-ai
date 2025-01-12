import React, { createContext, useState, useEffect, useContext } from "react";
import DragSelect, { DSInputElement } from "dragselect";

type ProviderProps = {
    children: React.ReactNode;
    settings?: ConstructorParameters<typeof DragSelect<DSInputElement>>[0];
    onDragEnd: (data: {
        items: DSInputElement[];
        event?: MouseEvent | TouchEvent | null | undefined | KeyboardEvent;
    }) => void;
    onDragSelect: (items: DSInputElement[]) => void;
};

const Context = createContext<DragSelect<DSInputElement> | undefined>(
    undefined
);

function useSubscribe({
    event,
    callback,
    ds,
}: {
    event: "DS:end";
    callback: (data: any) => void;
    ds?: DragSelect<DSInputElement>;
}) {
    useEffect(() => {
        if (!ds) return;
        ds.subscribe(event, callback);
        return () => {
            ds.unsubscribe(event);
        };
    }, [ds, event, callback]);
}

function DragSelectProvider({
    children,
    settings = {},
    onDragEnd,
    onDragSelect,
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

    useSubscribe({
        event: "DS:end",
        callback: ({ items, event, isDragging }) => {
            console.log("DS:end", items, event, isDragging);
            if (isDragging) {
                // we've just dragged a selection
                ds?.clearSelection();
                onDragEnd({ items, event });
            } else {
                // we've made a selection
                onDragSelect(items);
            }
        },
        ds,
    });

    return <Context.Provider value={ds}>{children}</Context.Provider>;
}

function useDragSelect() {
    return useContext(Context);
}

export { DragSelectProvider, useDragSelect };
