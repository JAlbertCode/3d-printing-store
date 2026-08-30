import type React from "react";
declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          alt?: string;
          "camera-controls"?: boolean;
          "auto-rotate"?: boolean;
          "animation-name"?: string;
          "camera-orbit"?: string;
          "shadow-intensity"?: string;
          exposure?: string;
          "tone-mapping"?: string;
          "interaction-prompt"?: string;
        },
        HTMLElement
      >;
    }
  }
}
