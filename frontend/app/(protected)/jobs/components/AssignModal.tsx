"use client";

import React, { useState } from "react";
import { Worker, VehicleType, VehicleOption } from "./types";

interface AssignModalProps {
  worker: Worker | null;
  vehicleOptions: VehicleOption[];
  destination: string;
  onConfirm: (workerId: string, vehicleType: VehicleType, vehicleNumber: string, wage: number) => void;
  onClose: () => void;
}

const VEHICLE_EMOJIS: Record<VehicleType, string> = {
  truck: "🚛",
  pickup: "🛻",
  minivan: "🚌",
};

const AVATAR_COLORS = [
  "#475569", "#64748b", "#334155", "#1e293b",
  "#0f172a", "#374151", "#4b5563", "#6b7280",
];
function getAvatarColor(initials: string): string {
  let hash = 0;
  for (let i = 0; i < initials.length; i++) hash = initials.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getInitialSelection(worker: Worker, vehicleOptions: VehicleOption[]) {
  const defaultType = worker.vehicleType ?? "truck";
  const opts = vehicleOptions.find((option) => option.type === defaultType);
  const defaultPlate = worker.vehicleNumber ?? opts?.plates[0] ?? "";
  return { defaultType, defaultPlate };
}

export default function AssignModal({ worker, vehicleOptions, destination, onConfirm, onClose }: AssignModalProps) {
  const activeWorker: Worker = worker ?? {
    id: "",
    name: "",
    initials: "",
  };
  const { defaultType, defaultPlate } = getInitialSelection(activeWorker, vehicleOptions);
  const [selectedType, setSelectedType] = useState<VehicleType>(defaultType);
  const [selectedPlate, setSelectedPlate] = useState<string>(defaultPlate);

  if (!worker) return null;

  const currentOpts = vehicleOptions.find((o) => o.type === selectedType);
  const wage = currentOpts?.wagePerRun ?? 0;
  const plates = currentOpts?.plates ?? [];
  const avatarBg = getAvatarColor(worker.initials);

  const handleTypeChange = (type: VehicleType) => {
    setSelectedType(type);
    const opts = vehicleOptions.find((o) => o.type === type);
    setSelectedPlate(opts?.plates[0] ?? "");
  };

  const handleConfirm = () => {
    if (!selectedPlate) return;
    onConfirm(worker.id, selectedType, selectedPlate, wage);
    onClose();
  };

  const FIELD_LABEL: React.CSSProperties = {
    fontSize: "0.62rem",
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "var(--color-dimmed)",
    marginBottom: "0.5rem",
    display: "block",
  };

  return (
    /* Overlay */
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: "fixed",
        inset: 0,
        background: "var(--color-overlay)",
        zIndex: 60,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        animation: "qos-fade 0.15s ease",
      }}
    >
      {/* Sheet */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: "var(--radius-box) var(--radius-box) 0 0",
          padding: "1.5rem 1.25rem 2.5rem",
          width: "100%",
          maxWidth: "480px",
          animation: "qos-slide 0.22s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem" }}>
          <div>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--foreground)", margin: 0 }}>
              Assign Worker
            </h2>
            <p style={{ fontSize: "0.72rem", color: "var(--color-dimmed)", marginTop: "0.2rem" }}>
              Select vehicle type, number and confirm wage
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: "transparent", border: "none", color: "var(--color-dimmed)", fontSize: "1.2rem", cursor: "pointer", lineHeight: 1, padding: "0.25rem" }}
          >
            ✕
          </button>
        </div>

        {/* Worker identity chip */}
        <div style={{
          display: "flex", alignItems: "center", gap: "0.875rem",
          background: "var(--color-primary-light)", borderRadius: "var(--radius-field)", padding: "0.875rem", marginBottom: "1.25rem",
        }}>
          <div style={{
            width: "2.75rem", height: "2.75rem", borderRadius: "var(--radius-selector)",
            background: avatarBg, color: "#ffffff",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "0.75rem", fontWeight: 700, flexShrink: 0,
          }}>
            {worker.initials}
          </div>
          <div>
            <p style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--foreground)", margin: 0 }}>{worker.name}</p>
            <p style={{ fontSize: "0.7rem", color: "var(--color-dimmed)", marginTop: "0.1rem" }}>No fixed vehicle — assigned at dispatch</p>
          </div>
        </div>

        {/* Destination */}
        <div style={{ marginBottom: "1rem" }}>
          <span style={FIELD_LABEL}>Destination (from job setup)</span>
          <div style={{
            background: "#ffffff", border: "1.5px solid var(--color-border-soft)",
            borderRadius: "var(--radius-field)", padding: "0.75rem 1rem",
            fontSize: "0.875rem", color: "var(--foreground)",
          }}>
            {destination}
          </div>
        </div>

        {/* Vehicle type pills */}
        <div style={{ marginBottom: "1rem" }}>
          <span style={FIELD_LABEL}>Vehicle Type</span>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {vehicleOptions.map((opt) => {
              const isActive = selectedType === opt.type;
              return (
                <button
                  key={opt.type}
                  onClick={() => handleTypeChange(opt.type)}
                  style={{
                    display: "flex", alignItems: "center", gap: "0.35rem",
                    padding: "0.45rem 0.875rem",
                    borderRadius: "var(--radius-selector)",
                    border: isActive ? "1.5px solid var(--color-primary)" : "1.5px solid var(--color-border-soft)",
                    background: isActive ? "var(--color-primary-light)" : "transparent",
                    color: isActive ? "var(--color-primary)" : "var(--color-muted)",
                    fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.06em",
                    textTransform: "uppercase", cursor: "pointer",
                  }}
                >
                  <span>{VEHICLE_EMOJIS[opt.type]}</span>
                  <span>{opt.type.toUpperCase()}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Vehicle number */}
        <div style={{ marginBottom: "1rem" }}>
          <span style={FIELD_LABEL}>Vehicle Number</span>
          <select
            value={selectedPlate}
            onChange={(e) => setSelectedPlate(e.target.value)}
            style={{
              width: "100%",
              background: "#ffffff",
              border: "1.5px solid var(--color-border-soft)",
              borderRadius: "var(--radius-field)",
              color: "var(--foreground)",
              padding: "0.75rem 1rem",
              fontSize: "0.875rem",
              fontFamily: "var(--font-sans, sans-serif)",
              appearance: "none",
              WebkitAppearance: "none",
              cursor: "pointer",
            }}
          >
            {plates.map((p) => (
              <option key={p} value={p} style={{ background: "#ffffff" }}>{p}</option>
            ))}
          </select>
        </div>

        {/* Wage box */}
        <div style={{
          background: "var(--color-primary-light)",
          border: "1px solid var(--color-border-soft)",
          borderRadius: "var(--radius-field)",
          padding: "0.875rem 1rem",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: "1.25rem",
        }}>
          <div>
            <p style={{ fontSize: "0.62rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-dimmed)", marginBottom: "0.2rem" }}>
              Auto-calculated wage
            </p>
            <p style={{ fontSize: "0.72rem", color: "var(--color-muted)" }}>
              {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} · 45 km · RM {wage} / run
            </p>
          </div>
          <span style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--color-primary)" }}>RM {wage}</span>
        </div>

        {/* Actions */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
          <button
            onClick={handleConfirm}
            style={{
              background: "var(--color-primary)", color: "#ffffff", border: "none",
              borderRadius: "var(--radius-field)", padding: "0.875rem",
              fontWeight: 800, fontSize: "0.8rem", letterSpacing: "0.08em",
              textTransform: "uppercase", cursor: "pointer",
            }}
          >
            ✓ Confirm
          </button>
          <button
            onClick={onClose}
            style={{
              background: "transparent", color: "var(--color-muted)",
              border: "1.5px solid var(--color-border-soft)",
              borderRadius: "var(--radius-field)", padding: "0.875rem",
              fontWeight: 700, fontSize: "0.8rem", letterSpacing: "0.08em",
              textTransform: "uppercase", cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Keyframe animations injected as a style tag — avoids any CSS file edits */}
      <style>{`
        @keyframes qos-fade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes qos-slide { from { transform: translateY(40px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
      `}</style>
    </div>
  );
}
