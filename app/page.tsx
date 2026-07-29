"use client";

import { useState } from "react";

export default function Home() {

  const [board, setBoard] = useState(Array(81).fill(0));

  return (
    // Horizontal centering
    <div className="
    min-h-screen flex flex-col items-center
    ">
      {/* Responsive */}
      <div className="
      min-h-screen flex flex-col justify-center gap-2
      w-90 md:w-135 xl:w-160
      ">
        {/* Grid wrapper */}
        <div className="
        grid grid-cols-9
        aspect-square
        ">
          {board.map((cell, index) => {

            const col = index % 9;
            const row = Math.floor(index / 9);

            return (
              <div
                key={index}
                className={`
                select-none
                border-separators
                text-numbers
                text-base md:text-2xl xl:text-4xl
                flex items-center justify-center
                ${col === 0 ? "border-l-4 border-l-separators-thick" : ""}
                ${row === 0 ? "border-t-4 border-t-separators-thick" : ""}
                ${col % 3 === 2 ? "border-r-4 border-r-separators-thick" : "border-r"}
                ${row % 3 === 2 ? "border-b-4 border-b-separators-thick" : "border-b"}
                `}
              >
                {cell === 0 ? "" : cell}
              </div>
            );
          })}
        </div>
        {/* Controls wrapper */}
        <div className="
        border-2 border-blue-500 text-center
        ">
          {/* Controls */}
          Comandi
        </div>
      </div>
    </div>
  );
}
