/**
 * DimensionModal Component
 *
 * A modal dialog for setting project resolution (width × height).
 * Provides preset options for common orientations and custom input fields.
 */

import { useState, useEffect } from "react";

interface DimensionModalProps {
  isOpen: boolean;
  onConfirm: (width: number, height: number) => void;
  onCancel: () => void;
  currentWidth: number;
  currentHeight: number;
}

const PRESETS = [
  { label: "16:9 HD", width: 1280, height: 720 },
  { label: "9:16 Vertical", width: 720, height: 1280 },
  { label: "1:1 Square", width: 1080, height: 1080 },
  { label: "4:5 Portrait", width: 1080, height: 1350 },
  { label: "16:9 4K", width: 3840, height: 2160 },
  { label: "9:16 4K", width: 2160, height: 3840 },
];

export const DimensionModal = ({
  isOpen,
  onConfirm,
  onCancel,
  currentWidth,
  currentHeight,
}: DimensionModalProps) => {
  const [width, setWidth] = useState(currentWidth);
  const [height, setHeight] = useState(currentHeight);

  useEffect(() => {
    if (isOpen) {
      setWidth(currentWidth);
      setHeight(currentHeight);
    }
  }, [isOpen, currentWidth, currentHeight]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(width, height);
  };

  const handlePreset = (preset: { width: number; height: number }) => {
    setWidth(preset.width);
    setHeight(preset.height);
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">Project Dimensions</h2>
        <p className="modal-subtitle">
          Set the canvas resolution for your project
        </p>

        <div className="dimension-presets">
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              className={`preset-btn ${
                width === preset.width && height === preset.height
                  ? "preset-btn-active"
                  : ""
              }`}
              onClick={() => handlePreset(preset)}
            >
              <span className="preset-label">{preset.label}</span>
              <span className="preset-size">
                {preset.width} × {preset.height}
              </span>
            </button>
          ))}
        </div>

        <div className="dimension-inputs">
          <div className="dimension-field">
            <label htmlFor="dimension-width">Width</label>
            <input
              id="dimension-width"
              type="number"
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              min={1}
              max={8192}
            />
          </div>
          <span className="dimension-separator">×</span>
          <div className="dimension-field">
            <label htmlFor="dimension-height">Height</label>
            <input
              id="dimension-height"
              type="number"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              min={1}
              max={8192}
            />
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn-ghost" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleConfirm}>
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default DimensionModal;
