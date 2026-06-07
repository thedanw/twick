import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";
import { Minus, Plus, Maximize } from "lucide-react";

/**
 * Zoom Plugin — Self-contained Zoom & Pan engine for Twick SDK.
 * Supports: Ctrl+Scroll Zoom, Middle-Click Pan, Trackpad Pinch & Pan.
 */

interface ZoomContextType {
  zoom: number;
  setZoom: (zoom: number | ((prev: number) => number)) => void;
  pan: { x: number; y: number };
  setPan: (pan: { x: number; y: number } | ((prev: { x: number; y: number }) => { x: number; y: number })) => void;
  resetZoom: () => void;
}

const ZoomContext = createContext<ZoomContextType | undefined>(undefined);

export const useWorkspaceZoom = () => {
  const context = useContext(ZoomContext);
  if (!context) throw new Error("useWorkspaceZoom must be used within a ZoomProvider");
  return context;
};

// Internal CSS to keep the plugin self-contained
const ZOOM_PLUGIN_CSS = `
  .zoom-plugin-controls-group {
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 2px;
    height: 28px;
    padding: 0 4px;
    gap: 2px;
  }

  .zoom-plugin-input-wrapper {
    display: flex;
    align-items: center;
    padding: 0 4px;
    min-width: 48px;
  }

  .zoom-plugin-input {
    width: 100%;
    background: transparent;
    border: none;
    color: rgba(255, 255, 255, 0.6);
    font-size: 11px;
    font-weight: 600;
    text-align: center;
    outline: none;
    cursor: text;
  }

  .zoom-plugin-input:focus {
    color: #fff;
  }

  .zoom-plugin-unit {
    font-size: 10px;
    color: rgba(255, 255, 255, 0.3);
    font-weight: bold;
    cursor: pointer;
    margin-left: -2px;
  }

  .zoom-plugin-unit:hover {
    color: #fff;
  }

  .zoom-plugin-separator {
    width: 1px;
    height: 12px;
    background: rgba(255, 255, 255, 0.1);
    margin: 0 4px;
  }
`;

export const ZoomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  const resetZoom = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  return (
    <ZoomContext.Provider value={{ zoom, setZoom, pan, setPan, resetZoom }}>
      <style>{ZOOM_PLUGIN_CSS}</style>
      {children}
    </ZoomContext.Provider>
  );
};

export const ZoomViewportWrapper: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  const { zoom, pan, setZoom, setPan } = useWorkspaceZoom();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });

  // Panning & Gestures
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = -e.deltaY;
        const factor = Math.pow(1.1, delta / 100);
        setZoom(prev => Math.min(Math.max(prev * factor, 0.1), 5.0));
      } else {
        // Trackpad 2-finger pan or Shift+Scroll
        e.preventDefault();
        const dx = e.shiftKey ? e.deltaY : e.deltaX;
        const dy = e.shiftKey ? 0 : e.deltaY;
        setPan(prev => ({ x: prev.x - dx, y: prev.y - dy }));
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      // Middle click (button 1) or Alt+Left
      if (e.button === 1 || (e.button === 0 && e.altKey)) {
        e.preventDefault();
        isDragging.current = true;
        startPos.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
        el.style.cursor = "grabbing";
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      setPan({
        x: e.clientX - startPos.current.x,
        y: e.clientY - startPos.current.y,
      });
    };

    const handleMouseUp = () => {
      if (isDragging.current) {
        isDragging.current = false;
        el.style.cursor = zoom > 1 ? "grab" : "default";
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    el.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      el.removeEventListener("wheel", handleWheel);
      el.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [zoom, pan, setZoom, setPan]);

  return (
    <div
      ref={wrapperRef}
      className={`zoom-plugin-viewport relative overflow-hidden ${className || ""}`}
      style={{
        width: "100%",
        height: "100%",
        cursor: zoom > 1 ? "grab" : "default",
      }}
    >
      <div
        className="zoom-plugin-inner-sync"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: "center center",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export const ZoomControls: React.FC = () => {
  const { zoom, setZoom, resetZoom } = useWorkspaceZoom();
  const [inputValue, setInputValue] = useState(Math.round(zoom * 100).toString());

  useEffect(() => {
    setInputValue(Math.round(zoom * 100).toString());
  }, [zoom]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    const val = parseInt(inputValue, 10);
    if (!isNaN(val)) {
      setZoom(val / 100);
    } else {
      setInputValue(Math.round(zoom * 100).toString());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleInputBlur();
      (e.target as HTMLInputElement).blur();
    }
  };

  return (
    <div className="zoom-plugin-controls-group">
      <button
        onClick={() => setZoom(prev => Math.max(prev - 0.1, 0.1))}
        className="btn-ghost"
        style={{ width: "24px", height: "24px", padding: 0 }}
        title="Zoom Out"
      >
        <Minus size={14} />
      </button>

      <div className="zoom-plugin-input-wrapper">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          className="zoom-plugin-input"
        />
        <span className="zoom-plugin-unit" onClick={resetZoom}>%</span>
      </div>

      <button
        onClick={() => setZoom(prev => Math.min(prev + 0.1, 5.0))}
        className="btn-ghost"
        style={{ width: "24px", height: "24px", padding: 0 }}
        title="Zoom In"
      >
        <Plus size={14} />
      </button>

      <div className="zoom-plugin-separator" />

      <button
        onClick={resetZoom}
        className="btn-ghost"
        style={{ width: "24px", height: "24px", padding: 0 }}
        title="Fit to Screen"
      >
        <Maximize size={14} />
      </button>
    </div>
  );
};
