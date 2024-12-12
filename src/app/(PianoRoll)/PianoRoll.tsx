"use client"

import React, { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import pixiPianoRoll from "./pixiPianoRoll.ts";

const PianoRoll = (props, playbackRef) => {
  const container = useRef<HTMLDivElement>(null);

  const pianoRoll = typeof window !== "undefined" ? pixiPianoRoll(props) : null;


  useImperativeHandle(playbackRef, () => pianoRoll?.playback)

  useEffect(() => {
    if (container.current && pianoRoll?.view) {
      container.current.appendChild(pianoRoll.view);
    }
  }, [!pianoRoll?.view]);

  return <div ref={container} />;
};

export default forwardRef(PianoRoll);