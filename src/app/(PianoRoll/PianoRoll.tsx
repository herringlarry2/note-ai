"use client"

import React, { useEffect, useState } from "react";
import { Stage, Container, Graphics } from "@pixi/react";
import dynamic from "next/dynamic";

const PianoRollComponent = ({ notes, width, height }) => {
  const keyHeight = 20; // Height of one key in the piano roll
  const timeUnitWidth = 50; // Width of one time unit
  console.log("rendering2");

  const drawGrid = (g) => {
    g.clear();
    g.lineStyle(1, 0xdddddd);

    // Draw horizontal lines (piano keys)
    for (let y = 0; y < height; y += keyHeight) {
      g.moveTo(0, y);
      g.lineTo(width, y);
    }

    // Draw vertical lines (time units)
    for (let x = 0; x < width; x += timeUnitWidth) {
      g.moveTo(x, 0);
      g.lineTo(x, height);
    }
  };

  const drawNotes = (g) => {
    g.beginFill(0x88c0d0);

    notes.forEach((note) => {
      const x = note.startTime * timeUnitWidth; // Start time in pixels
      const y = (127 - note.pitch) * keyHeight; // Pitch in pixels (127 MIDI max value)
      const noteWidth = note.duration * timeUnitWidth; // Duration in pixels
      const noteHeight = keyHeight;

      g.drawRect(x, y, noteWidth, noteHeight);
    });

    g.endFill();
  };

  console.log("rendering");

  return (
    <Stage width={width} height={height} options={{ backgroundColor: 0x282c34 }}>
      <Container>
        {/* Grid */}
        <Graphics draw={drawGrid} />

        {/* Notes */}
        <Graphics draw={drawNotes} />
      </Container>
    </Stage>
  );
};

const PianoRoll = dynamic(() => Promise.resolve(PianoRollComponent), {
    ssr: false
  });
  
export default PianoRoll;

