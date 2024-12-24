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
    ds?.setSettings(settings);
  }, [ds, settings]);

  useEffect(() => {
    ds?.subscribe("DS:end", (event) => {
      console.log(event);
    });

    return () => {
      ds?.unsubscribe("DS:end");
    };
  }, [ds]);

  useEffect(() => {
    ds?.subscribe("DS:scroll", (event) => {
      console.log(event);
    });

    return () => {
      ds?.unsubscribe("DS:scroll");
    };
  }, [ds]);

  return <Context.Provider value={ds}>{children}</Context.Provider>;
}

function useDragSelect() {
  return useContext(Context);
}

export { DragSelectProvider, useDragSelect };