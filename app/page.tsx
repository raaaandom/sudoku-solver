"use client";

import { useEffect, useState, useRef } from "react";

export default function Home() {

  const [board, setBoard] = useState(Array(81).fill(0));
  const [selected, setSelected] = useState(-1);

  const gridRef = useRef<HTMLDivElement>(null);

  function handleCellClick(index: number) {
    setSelected(index);
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (gridRef.current && !gridRef.current.contains(e.target as Node))
        setSelected(-1);
    }

    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  })

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (selected === -1) return;

      const num_keys = "0123456789";
      const move_keys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];

      // number input
      if (num_keys.includes(e.key)) {
        const newBoard = [...board];
        newBoard[selected] = e.key;
        setBoard(newBoard);
        return;
      }
      // escape deselection
      else if (e.key === 'Escape') {
        setSelected(-1);
        return;
      }
      // move selection
      else if (move_keys.includes(e.key)) {
        let offset = 0;

        if (e.key === 'ArrowRight' && selected % 9 === 8) return;
        if (e.key === 'ArrowLeft' && selected % 9 === 0) return;

        if (e.key === 'ArrowLeft') offset = -1;
        else if (e.key === 'ArrowRight') offset = +1;
        else if (e.key === 'ArrowUp') offset = -9;
        else if (e.key === 'ArrowDown') offset = +9;

        if (selected + offset >= 0 && selected + offset < board.length) {
          setSelected(selected + offset);
        }
      }

    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  })

  return (
    // Horizontal centering
    <div
      className="
      min-h-screen flex flex-col items-center
    ">
      {/* Responsive */}
      <div
        className="
        min-h-screen flex flex-col justify-center gap-2
        w-90 md:w-135 xl:w-160
      ">
        {/* Grid wrapper */}
        <div
          ref={gridRef}
          className="
          grid grid-cols-9 grid-rows-9
          aspect-square
        ">
          {board.map((cell, index) => {

            const col = index % 9;
            const row = Math.floor(index / 9);

            return (
              <div
                key={index}
                onMouseDown={() => handleCellClick(index)}
                className={`
                text-numbers text-base md:text-2xl xl:text-4xl
                flex items-center justify-center aspect-square
                select-none
                border-separators
                ${index === selected ? "bg-selected-cell" : ""}
                ${col === 0 ? "border-l-4 border-l-separators-thick" : ""}
                ${row === 0 ? "border-t-4 border-t-separators-thick" : ""}
                ${col % 3 === 2 ? "border-r-4 border-r-separators-thick" : "border-r"}
                ${row % 3 === 2 ? "border-b-4 border-b-separators-thick" : "border-b"}
                `}
              >
                {Number(cell) === 0 ? "" : cell}
              </div>
            );
          })}
        </div>
        {/* Controls wrapper */}
        <div
          className="
          border-2 border-blue-500 text-center
        ">
          {/* Controls */}
          Comandi
        </div>
      </div>
    </div>
  );
}
