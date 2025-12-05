"use client";
import { useUpdateMyPresence, useOthers } from "@liveblocks/react";
import { useEffect } from "react";
import NameCursor from "./cursor"; // <-- your new cursor

export default function CollaborativeCursors() {
  const updateMyPresence = useUpdateMyPresence();
  const others = useOthers();

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      updateMyPresence({
        cursor: {
          x: event.clientX,
          y: event.clientY,
        },
      });
    };

    const onLeave = () => updateMyPresence({ cursor: null });

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerleave", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, [updateMyPresence]);

  return (
    <>
      {others.map(({ connectionId, presence, info }) => {
        if (!presence.cursor) return null;

        const base = info?.color;

        const gradient: [string, string] = [
          base,
          LightenDarkenColor(base, 200),
        ];

        return (
          <NameCursor
            key={connectionId}
            name={info?.name || "Anonymous"}
            color={gradient}
            x={presence.cursor.x}
            y={presence.cursor.y}
          />
        );
      })}
    </>
  );
}

function LightenDarkenColor(col: string, amt: number) {
  const num = parseInt(col.replace(/^#/, ""), 16);
  let r = (num >> 16) + amt;
  let g = ((num >> 8) & 0x00ff) + amt;
  let b = (num & 0x0000ff) + amt;

  r = Math.max(Math.min(255, r), 0);
  g = Math.max(Math.min(255, g), 0);
  b = Math.max(Math.min(255, b), 0);

  return (
    "#" +
    ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()
  );
}
