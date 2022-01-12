import React from "react";
import { useStore } from "../state";

export const EnabledLeds = ({ currentFrame }) => {
  console.log({ currentFrame });
  const { "project.sections": sections, [`project.frames`]: frames } = useStore(
    ["project.sections", `project.frames`]
  );
  console.log({ currentFrame, frames });

  const pixels = frames.map((frame) => {
    if (!frame) return [];
    return frame.map((f) => {
      const thisSection = sections[f.section];
      let index = f.row * thisSection.w + (f.col + 1);
      if (thisSection.serpentine) {
        const isOdd = !(f.row % 2);
        if (isOdd) {
          index = f.row * thisSection.w + (thisSection.w - f.col);
        }
      }
      return [
        index + (thisSection.pixelOffset || 0) - 1,
        `color.RGBA{R: ${f.r}, G: ${f.g}, B: ${f.b}}`,
      ];
    });
  });
  console.log({ pixels });
  return (
    <pre style={{ zIndex: 100 }}>
      <code>{JSON.stringify(pixels, null, "  ")}</code>
    </pre>
  );
};
