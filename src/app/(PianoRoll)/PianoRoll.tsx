"use client"

import React, { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import pixiPianoRoll from "./pixiPianoRoll.ts";

const PianoRoll = (props, playbackRef) => {
  const container = useRef();

  const pianoRoll = pixiPianoRoll(props);

  useImperativeHandle(playbackRef, () => pianoRoll.playback)

  useEffect(() => {
    container.current.appendChild(pianoRoll.view);
  });

  return <div ref={container} />;
};

export default forwardRef(PianoRoll);