/**
 * StudioHeader Component
 *
 * The top header bar of the studio interface. Contains the studio logo,
 * orientation controls, and action divs for saving and exporting.
 *
 * @component
 * @param {Object} props
 * @param {(resolution: Size) => void} props.setVideoResolution - Callback to update canvas resolution
 *
 * @example
 * ```tsx
 * <StudioHeader
 *   setVideoResolution={(size) => console.log(`New size: ${size.width}x${size.height}`)}
 * />
 * ```
 */

import type { Size } from "@twick/timeline";
import { Save, Download, Clapperboard, File, Plus } from "lucide-react";
import { ZoomControls } from "../plugins/zoom";

interface StudioHeaderProps {
  setVideoResolution: (resolution: Size) => void;
  onNewProject: () => void;
  onLoadProject: () => void;
  onSaveProject: () => void;
  onExportVideo: () => void;
  onExportCaptions: (format: "srt" | "vtt") => void;
  onExportChapters: (format: "youtube" | "json") => void;
}
export const StudioHeader = ({
  setVideoResolution,
  onNewProject,
  onLoadProject,
  onSaveProject,
  onExportVideo,
}: StudioHeaderProps) => {
  return (
    <header className="header">
      <div className="flex-container">
        <Clapperboard className="icon-lg accent-purple" />
        <h1 className="text-gradient">
          Twick Studio
        </h1>
      </div>
      <div className="flex-container" style={{ gap: "8px" }}>
        <ZoomControls />
        <div className="header-separator"></div>
      </div>
      <div className="flex-container">
        <button
          className="btn-ghost"
          title="New Project"
          onClick={onNewProject}
        >
          <Plus className="icon-sm" />
          New Project
        </button>
        <button
          className="btn-ghost"
          title="Load Project"
          onClick={onLoadProject}
        >
          <File className="icon-sm" />
          Load Project
        </button>
        <button
          className="btn-ghost"
          title="Save Draft"
          onClick={onSaveProject}
        >
          <Save className="icon-sm" />
          Save Draft
        </button>
        {/* <button
          className="btn-ghost"
          title="Export captions as SRT"
          onClick={() => onExportCaptions("srt")}
        >
          <Download className="icon-sm" />
          SRT
        </button>
        <button
          className="btn-ghost"
          title="Export captions as VTT"
          onClick={() => onExportCaptions("vtt")}
        >
          <Download className="icon-sm" />
          VTT
        </button>
        <button
          className="btn-ghost"
          title="Export chapters as YouTube timestamps"
          onClick={() => onExportChapters("youtube")}
        >
          <Download className="icon-sm" />
          Chapters TXT
        </button>
        <button
          className="btn-ghost"
          title="Export chapters as JSON"
          onClick={() => onExportChapters("json")}
        >
          <Download className="icon-sm" />
          Chapters JSON
        </button> */}
        <button
          className="btn-primary"
          title="Export"
          onClick={onExportVideo}
        >
          <Download className="icon-sm" />
          Export
        </button>
      </div>
    </header>
  );
};

export default StudioHeader;
