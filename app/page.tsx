"use client";

import { useEffect, useState, useRef } from "react";
import { solveFromString } from "./utils/dlx";

export default function Home() {

  const [board, setBoard] = useState(Array(81).fill(0));
  const [selected, setSelected] = useState(-1);
  const [picked, setPicked] = useState(-1);

  const gridRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLDivElement>(null);

  function handleClear() {
    setBoard(Array(81).fill(0));
  }

  function handleRun() {
    const board_string = board.join().replaceAll(",", "");
    const sol = solveFromString(board_string);
    if (sol !== null) {
      const new_board = sol.flat(Infinity);
      setBoard(new_board);
    }
  }

  function writeBoard(idx: number, value: number) {
    const newBoard = [...board];
    newBoard[idx] = value;
    setBoard(newBoard);
  }

  function handleCellClick(index: number) {
    if (picked !== -1) {
      writeBoard(index, picked)
    };
    setSelected(index);
  }

  function handleNumClick(index: number) {
      console.log(selected)
    if (selected !== -1) {
      writeBoard(selected, index)
    };
    setPicked(index);
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!gridRef.current) return;
      if (!numRef.current) return;

      if (!gridRef.current.contains(e.target as Node) && !numRef.current.contains(e.target as Node)) {
        setPicked(-1);
        setSelected(-1);
      }
    }

    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  })

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (selected === -1) return;

      const num_keys = '0123456789';
      const move_keys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

      // number input
      if (num_keys.includes(e.key)) {
        writeBoard(selected, Number(e.key));
      }
      // escape deselection
      else if (e.key === 'Escape') {
        setSelected(-1);
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
      // number deletion
      else if (e.key === 'Backspace') {
        writeBoard(selected, Number(0));
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
        min-h-screen flex flex-col justify-center gap-6
        w-90 md:w-135 xl:w-160
        md:text-2xl xl:text-4xl
      ">

        {/* Grid wrapper */}
        <div
          ref={gridRef}
          className="
          bg-cell-background
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
                text-cell-number text-base text-[length:inherit]
                flex items-center justify-center aspect-square
                select-none
                border-separator-thin
                ${index === selected ? "bg-cell-selected" : ""}
                ${col === 0 ? "border-l-4 border-l-separator-thick" : ""}
                ${row === 0 ? "border-t-4 border-t-separator-thick" : ""}
                ${col % 3 === 2 ? "border-r-4 border-r-separator-thick" : "border-r"}
                ${row % 3 === 2 ? "border-b-4 border-b-separator-thick" : "border-b"}
                `}
              >
                {Number(cell) === 0 ? "" : cell}
              </div>
            );
          })}
        </div>

        {/* Numbers Panel */}
        <div
          ref={numRef}
          className="
          flex flex-row gap-1 px-1 justify-center
          ">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num, idx) => {
            return <button key={idx}
              onClick={() => handleNumClick(idx)}
              className={`
              aspect-square px-2 py-1 w-full
              border-3 border-blue-600 rounded text-blue-600
              ${picked === idx ? "bg-blue-600 text-page-background" : ""}
              `}
            >
              {num}
            </button>
          })}
        </div>

        {/* Controls wrapper */}
        <div
          className="
          flex flex-row gap-6 px-1 justify-center
        ">
          {/* Run */}
          <button
            onClick={() => handleRun()}
            className="
            bg-control-run hover:bg-control-run-hover active:bg-control-run-active
            text-control-run-text
            py-2 px-12 rounded-md
            flex-1 flex flex-col items-center
            font-bold
          ">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
            </svg>
          </button>
          {/* Clear */}
          <button
            onClick={() => handleClear()}
            className="
            text-control-clear-text
            bg-control-clear hover:bg-control-clear-hover active:bg-control-clear-active
            py-2 px-4 rounded-md
            font-bold
          ">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

      </div>
    </div>
  );
}
