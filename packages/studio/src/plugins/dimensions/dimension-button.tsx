import type { Size } from "@twick/timeline";
import { Maximize2 } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import DimensionModal from "./dimension-modal";
import { DIMENSIONS_PLUGIN_STYLES } from "./dimensions-plugin-styles";

export interface DimensionButtonProps {
  setVideoResolution: (resolution: Size) => void;
}

/**
 * DimensionButton — self-contained dimension selector for the studio header.
 */
export function DimensionButton({ setVideoResolution }: DimensionButtonProps) {
  const [showDimensionModal, setShowDimensionModal] = useState(false);
  const [currentResolution, setCurrentResolution] = useState<Size>({
    width: 720,
    height: 1280,
  });

  // Load saved dimensions from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("projectDimensions");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.width && parsed?.height) {
          setCurrentResolution({ width: parsed.width, height: parsed.height });
        }
      } catch {
        // Backward compat: old "horizontal" | "vertical" format
        const oldOrientation = localStorage.getItem("orientation");
        if (oldOrientation === "horizontal") {
          setCurrentResolution({ width: 1280, height: 720 });
        } else if (oldOrientation === "vertical") {
          setCurrentResolution({ width: 720, height: 1280 });
        }
      }
    }
  }, []);

  const handleDimensionConfirm = (width: number, height: number) => {
    const newResolution = { width, height };
    setCurrentResolution(newResolution);
    localStorage.setItem("projectDimensions", JSON.stringify(newResolution));
    setVideoResolution(newResolution);
    setShowDimensionModal(false);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: DIMENSIONS_PLUGIN_STYLES }} />
      <button
        className="btn-ghost"
        title={`Dimensions (${currentResolution.width} × ${currentResolution.height})`}
        onClick={() => setShowDimensionModal(true)}
      >
        <Maximize2 className="icon-sm" />
        <span className="text-sm">{currentResolution.width}×{currentResolution.height}</span>
      </button>
      {showDimensionModal &&
        createPortal(
          <DimensionModal
            isOpen={showDimensionModal}
            onConfirm={handleDimensionConfirm}
            onCancel={() => setShowDimensionModal(false)}
            currentWidth={currentResolution.width}
            currentHeight={currentResolution.height}
          />,
          document.body
        )}
    </>
  );
}
