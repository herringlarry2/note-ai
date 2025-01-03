import React, { createContext, useState, useEffect, useContext } from "react";
import DragSelect, { DSInputElement } from "dragselect";

type ProviderProps = {
    children: React.ReactNode;
    settings?: ConstructorParameters<typeof DragSelect<DSInputElement>>[0];
};

const Context = createContext<DragSelect<DSInputElement> | undefined>(
    undefined
);

function DragSelectProvider({ children, settings = {} }: ProviderProps) {
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
            ds.subscribe("DS:end", (e) => {
                // On end update the notes to the nearest cell
            });
        }
    }, [ds]);

    useEffect(() => {
        if (ds) {
            ds.subscribe("dragstart", ({ event, items }) => {
                event.preventDefault(); // Prevent default position recalculation
                console.log("Drag started:", items);
            });
        }
    }, [ds]);

    useEffect(() => {
        if (ds) {
            ds.subscribe("DS:select", ({ event, items }) => {
                console.log("event", event);
                console.log("Drag ended:", items);
            });
        }
    }, [ds]);

    return <Context.Provider value={ds}>{children}</Context.Provider>;
}

function useDragSelect() {
    return useContext(Context);
}

export { DragSelectProvider, useDragSelect };
