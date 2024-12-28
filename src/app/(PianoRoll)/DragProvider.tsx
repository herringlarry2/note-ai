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

    console.log(ds?.getSelection());

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
        const { area } = settings;
        if (ds && area) {
            ds.setSettings({ ...settings, area });
        }
    }, [ds, settings]);

    useEffect(() => {
        if (ds) {
            ds.subscribe("DS:end", ({ event }) => {
                console.log(event);
            });
        }
    }, [ds]);

    return <Context.Provider value={ds}>{children}</Context.Provider>;
}

function useDragSelect() {
    return useContext(Context);
}

export { DragSelectProvider, useDragSelect };
