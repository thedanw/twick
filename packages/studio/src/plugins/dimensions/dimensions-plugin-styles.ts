export const DIMENSIONS_PLUGIN_STYLES = `
/* ═══════════════════════════════════════════
   DIMENSION MODAL PLUGIN STYLES
   ═══════════════════════════════════════════ */

/* Full-screen overlay */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  backdrop-filter: blur(6px);
}

/* Modal dialog container */
.modal-content {
  width: 100%;
  max-width: 420px;
  border-radius: 2px;
  background: var(--nl-bg-tool-titlebar, #1E1E1E);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.55);
  padding: 1.25rem;
}

/* Modal title */
.modal-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-gray-100, #f3f3f3);
  margin: 0 0 0.25rem 0;
}

/* Modal subtitle */
.modal-subtitle {
  font-size: 0.8rem;
  color: var(--color-gray-400, #9c9c9c);
  margin: 0 0 1rem 0;
}

/* Preset button grid */
.dimension-presets {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  margin-bottom: 1rem;
}

/* Individual preset button */
.preset-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.125rem;
  padding: 0.5rem 0.375rem;
  border-radius: 2px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  color: var(--color-gray-300, #d1d1d1);
  cursor: pointer;
  transition: all 0.15s ease;
  font-size: 0.75rem;
}

.preset-btn:hover {
  border-color: var(--nl-accent, #FF7300);
  background: var(--nl-accent-muted, rgba(255, 115, 0, 0.15));
  color: #ffffff;
}

.preset-btn-active {
  border-color: var(--nl-accent, #FF7300) !important;
  background: var(--nl-accent-muted, rgba(255, 115, 0, 0.15)) !important;
  color: #ffffff !important;
}

.preset-label {
  font-weight: 500;
  font-size: 0.7rem;
}

.preset-size {
  font-size: 0.65rem;
  color: var(--color-gray-400, #9c9c9c);
}

.preset-btn-active .preset-size {
  color: var(--color-gray-200, #e5e5e5);
}

/* Custom dimension inputs row */
.dimension-inputs {
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.dimension-field {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.dimension-field label {
  font-size: 0.7rem;
  color: var(--color-gray-400, #9c9c9c);
  font-weight: 500;
}

.dimension-field input {
  width: 100%;
  padding: 0.375rem 0.5rem;
  border-radius: 2px;
  background: var(--color-neutral-800, #1f1f1f);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--color-gray-100, #f3f3f3);
  font-size: 0.85rem;
  text-align: center;
  box-sizing: border-box;
}

.dimension-field input:focus {
  border-color: var(--nl-accent, #FF7300);
  box-shadow: 0 0 0 1px var(--nl-accent-muted, rgba(255, 115, 0, 0.15));
  outline: none;
}

/* Hide number input spinners */
.dimension-field input::-webkit-outer-spin-button,
.dimension-field input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.dimension-field input[type="number"] {
  -moz-appearance: textfield;
}

/* Separator between width/height */
.dimension-separator {
  font-size: 1rem;
  color: var(--color-gray-400, #9c9c9c);
  padding-bottom: 0.375rem;
  flex-shrink: 0;
}

/* Modal action buttons */
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}
`;
