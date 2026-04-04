"use client";

import React from "react";
import { Worker } from "./types";

interface WorkerRowProps {
  worker: Worker;
  onAssign: (worker: Worker) => void;
}

const AVATAR_COLORS = [
  "#F59E0B", "#8B5CF6", "#10B981", "#3B82F6",
  "#EF4444", "#EC4899", "#14B8A6", "#F97316",
];

function getAvatarColor(initials: string): string {
  let hash = 0;
  for (let i = 0; i < initials.length; i++) {
    hash = initials.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export default function WorkerRow({ worker, onAssign }: WorkerRowProps) {
  const isAssigned = !!worker.vehicleType;
  const avatarBg = getAvatarColor(worker.initials);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.875rem",
        background: "#ffffff",
        border: "1px solid var(--color-border-soft)",
        borderRadius: "var(--radius-field)",
        padding: "0.875rem 1rem",
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: "2.5rem",
          height: "2.5rem",
          borderRadius: "var(--radius-selector)",
          background: avatarBg,
          color: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "0.72rem",
          fontWeight: 700,
          flexShrink: 0,
          letterSpacing: "0.03em",
        }}
      >
        {worker.initials}
      </div>

      {/* Name + status */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontWeight: 700,
          fontSize: "0.875rem",
          color: "var(--foreground)",
          marginBottom: "0.15rem",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}>
          {worker.name}
        </p>

        {isAssigned ? (
          <p style={{ fontSize: "0.72rem", color: "var(--color-muted)", display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
            <span style={{ color: "var(--color-success)", fontWeight: 600 }}>{worker.vehicleType}</span>
            <span>·</span>
            <span>{worker.vehicleNumber}</span>
            <span>·</span>
            <span style={{ color: "var(--color-primary)" }}>RM {worker.wage}/run</span>
          </p>
        ) : (
          <p style={{ fontSize: "0.7rem", color: "var(--color-dimmed)" }}>
            Not assigned — <span style={{ letterSpacing: "0.05em" }}>tap ASSIGN</span>
          </p>
        )}
      </div>

      {/* Assign / Reassign button */}
      <button
        onClick={() => onAssign(worker)}
        style={{
          flexShrink: 0,
          padding: "0.4rem 0.875rem",
          borderRadius: "var(--radius-selector)",
          fontSize: "0.7rem",
          fontWeight: 700,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          cursor: "pointer",
          whiteSpace: "nowrap",
          ...(isAssigned
            ? {
                background: "transparent",
                border: "1.5px solid var(--color-success)",
                color: "var(--color-success)",
              }
            : {
                background: "var(--color-primary)",
                border: "none",
                color: "#ffffff",
              }),
        }}
      >
        {isAssigned ? "⟳ Reassign" : "Assign"}
      </button>
    </div>
  );
}
