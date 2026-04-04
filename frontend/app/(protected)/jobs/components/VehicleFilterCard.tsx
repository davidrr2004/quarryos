"use client";

import React from "react";

export type VehicleFilterType = "all" | "truck" | "pickup" | "minivan";

interface VehicleFilterCardProps {
  type: VehicleFilterType;
  count: number;
  active: boolean;
  onClick: () => void;
}

const VEHICLE_META: Record<VehicleFilterType, { label: string; emoji: string }> = {
  all:     { label: "All",     emoji: "🚦" },
  truck:   { label: "Truck",   emoji: "🚛" },
  pickup:  { label: "Pickup",  emoji: "🛻" },
  minivan: { label: "Minivan", emoji: "🚌" },
};

export default function VehicleFilterCard({ type, count, active, onClick }: VehicleFilterCardProps) {
  const meta = VEHICLE_META[type];

  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.2rem",
        padding: "0.75rem 0.5rem",
        borderRadius: "var(--radius-field)",
        border: active ? "2px solid var(--color-primary)" : "2px solid var(--color-border-soft)",
        background: active ? "var(--color-primary-light)" : "#ffffff",
        cursor: "pointer",
        transition: "border-color 0.18s, background 0.18s",
        minWidth: 0,
        WebkitTapHighlightColor: "transparent",
      }}
    >
      <span style={{ fontSize: "1.5rem", lineHeight: 1 }}>{meta.emoji}</span>
      <span style={{
        fontSize: "0.6rem",
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: "var(--color-muted)",
        marginTop: "0.15rem",
      }}>
        {meta.label}
      </span>
      <span style={{
        fontSize: "1.35rem",
        fontWeight: 800,
        color: "var(--color-primary)",
        lineHeight: 1.1,
      }}>
        {count}
      </span>
      <span style={{ fontSize: "0.58rem", color: "var(--color-dimmed)" }}>available</span>
    </button>
  );
}
