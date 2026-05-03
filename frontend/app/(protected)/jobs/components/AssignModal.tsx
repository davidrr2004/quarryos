"use client";

import React, { useState } from "react";
import { Worker, VehicleType, VehicleOption } from "./types";

interface AssignModalProps {
  worker: Worker | null;
  vehicleOptions: VehicleOption[];
  onConfirm: (
    workerId: string,
    vehicleType: VehicleType,
    vehicleNumber: string,
    wage: number,
    routeFrom: string,
    routeTo: string,
    distanceKm: number,
  ) => void;
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

export default function AssignModal({ worker, vehicleOptions, onConfirm, onClose }: AssignModalProps) {
  const activeWorker = worker ?? { id: "", name: "", initials: "" };
  const defaultType = (activeWorker as Worker).vehicleType ?? "truck";
  const defaultOpts = vehicleOptions.find((o) => o.type === defaultType);
  const defaultPlate = defaultOpts?.plates[0] ?? "";

  const [selectedType, setSelectedType] = useState<VehicleType>(defaultType);
  const [selectedPlate, setSelectedPlate] = useState<string>(defaultPlate);
  const [routeFrom, setRouteFrom] = useState("");
  const [routeTo, setRouteTo] = useState("");
  const [distanceKm, setDistanceKm] = useState("");
  const [formError, setFormError] = useState("");

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
    setFormError("");
    if (!selectedPlate) { setFormError("Select a vehicle number."); return; }
    if (!routeFrom.trim()) { setFormError("Enter the pickup location."); return; }
    if (!routeTo.trim()) { setFormError("Enter the drop-off location."); return; }
    const dist = parseFloat(distanceKm);
    if (!distanceKm || isNaN(dist) || dist <= 0) { setFormError("Enter a valid distance in km."); return; }

    onConfirm(worker.id, selectedType, selectedPlate, wage, routeFrom.trim(), routeTo.trim(), dist);
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

  const INPUT_STYLE: React.CSSProperties = {
    width: "100%",
    background: "#ffffff",
    border: "1.5px solid var(--color-border-soft)",
    borderRadius: "var(--radius-field)",
    color: "var(--foreground)",
    padding: "0.75rem 1rem",
    fontSize: "0.875rem",
    fontFamily: "var(--font-sans, sans-serif)",
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: "fixed", inset: 0,
        background: "var(--color-overlay)",
        zIndex: 60,
        display: "flex", alignItems: "flex-end", justifyContent: "center",
        animation: "qos-fade 0.15s ease",
      }}
    >
      <div
        style={{
          background: "#ffffff",
          borderRadius: "var(--radius-box) var(--radius-box) 0 0",
          padding: "1.5rem 1.25rem 2.5rem",
          width: "100%",
          maxWidth: "480px",
          maxHeight: "92vh",
          overflowY: "auto",
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
              Vehicle · Route · Confirm wage
            </p>
          </div>
          <button onClick={onClose} style={{ background: "transparent", border: "none", color: "var(--color-dimmed)", fontSize: "1.2rem", cursor: "pointer", lineHeight: 1, padding: "0.25rem" }}>
            ✕
          </button>
        </div>

        {/* Worker chip */}
        <div style={{
          display: "flex", alignItems: "center", gap: "0.875rem",
          background: "var(--color-primary-light)", borderRadius: "var(--radius-field)",
          padding: "0.875rem", marginBottom: "1.25rem",
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
            <p style={{ fontSize: "0.7rem", color: "var(--color-dimmed)", marginTop: "0.1rem" }}>Ready for assignment</p>
          </div>
        </div>

        {/* Route From */}
        <div style={{ marginBottom: "1rem" }}>
          <span style={FIELD_LABEL}>Pickup Location (From)</span>
          <input
            type="text"
            placeholder="e.g. Quarry Site A"
            value={routeFrom}
            onChange={(e) => setRouteFrom(e.target.value)}
            style={INPUT_STYLE}
          />
        </div>

        {/* Route To */}
        <div style={{ marginBottom: "1rem" }}>
          <span style={FIELD_LABEL}>Drop-off Location (To)</span>
          <input
            type="text"
            placeholder="e.g. Crushing Plant B"
            value={routeTo}
            onChange={(e) => setRouteTo(e.target.value)}
            style={INPUT_STYLE}
          />
        </div>

        {/* Distance */}
        <div style={{ marginBottom: "1rem" }}>
          <span style={FIELD_LABEL}>Distance (km)</span>
          <input
            type="number"
            placeholder="e.g. 45"
            min="0"
            step="0.1"
            value={distanceKm}
            onChange={(e) => setDistanceKm(e.target.value)}
            style={INPUT_STYLE}
          />
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
                  <span style={{ opacity: 0.6 }}>({opt.plates.length})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Vehicle number */}
        <div style={{ marginBottom: "1rem" }}>
          <span style={FIELD_LABEL}>Vehicle Number</span>
          {plates.length === 0 ? (
            <p style={{ fontSize: "0.8rem", color: "var(--color-error)", padding: "0.5rem 0" }}>
              No available vehicles of this type.
            </p>
          ) : (
            <select
              value={selectedPlate}
              onChange={(e) => setSelectedPlate(e.target.value)}
              style={{ ...INPUT_STYLE, appearance: "none", WebkitAppearance: "none", cursor: "pointer" }}
            >
              {plates.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          )}
        </div>

        {/* Wage display */}
        <div style={{
          background: "var(--color-primary-light)",
          border: "1px solid var(--color-border-soft)",
          borderRadius: "var(--radius-field)",
          padding: "0.875rem 1rem",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: "1rem",
        }}>
          <div>
            <p style={{ fontSize: "0.62rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-dimmed)", marginBottom: "0.2rem" }}>
              Auto-calculated wage
            </p>
            <p style={{ fontSize: "0.72rem", color: "var(--color-muted)" }}>
              {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} · ₹{wage} / run
            </p>
          </div>
          <span style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--color-primary)" }}>₹{wage}</span>
        </div>

        {/* Error */}
        {formError && (
          <p style={{ fontSize: "0.78rem", color: "var(--color-error)", marginBottom: "0.75rem", fontWeight: 600 }}>
            ⚠ {formError}
          </p>
        )}

        {/* Actions */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
          <button
            onClick={handleConfirm}
            disabled={plates.length === 0}
            style={{
              background: plates.length === 0 ? "var(--color-muted)" : "var(--color-primary)",
              color: "#ffffff", border: "none",
              borderRadius: "var(--radius-field)", padding: "0.875rem",
              fontWeight: 800, fontSize: "0.8rem", letterSpacing: "0.08em",
              textTransform: "uppercase", cursor: plates.length === 0 ? "not-allowed" : "pointer",
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

      <style>{`
        @keyframes qos-fade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes qos-slide { from { transform: translateY(40px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
      `}</style>
    </div>
  );
}
