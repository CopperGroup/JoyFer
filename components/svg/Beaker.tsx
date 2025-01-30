"use client"

import type React from "react"

interface BuildingBlockCursorProps {
  cursor: { x: number; y: number }
  cardRef: React.RefObject<HTMLDivElement>
}

export default function Beaker({ cursor, cardRef }: BuildingBlockCursorProps) {
  if (cardRef.current === null) return null
  const { x, y } = cursor

  const cursorX = x
  const cursorY = y

  const style = {
    left: `${cursorX}px`,
    top: `${cursorY}px`,
  }

  return (
    <div
      className="absolute z-0 pointer-events-none w-16 h-16 rounded-full bg-yellow-300 opacity-50 blur-xl"
      style={{
        ...style,
        transform: "translate(-50%, -50%)",
      }}
    />
  )
}

