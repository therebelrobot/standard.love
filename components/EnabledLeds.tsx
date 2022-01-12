import React from "react";
import { useStore } from "../state";

export const EnabledLeds = ({ currentFrame }) => {
  console.log({ currentFrame });
  const {
    "project.sections": sections,
    [`project.frames`]: frames,
    "project.frameDelay": frameDelay,
  } = useStore(["project.sections", `project.frames`, "project.frameDelay"]);
  console.log({ currentFrame, frames });

  let goAddressString = `var LED_ADDRESSES = [][]int{\n`;
  let goColorString = `var LED_COLORS = [][]color.RGBA{\n`;

  const pixels = frames.map((frame, fi) => {
    goAddressString += "  {";
    goColorString += "  {";
    if (!frame) {
      goAddressString += "  }";
      goColorString += "  }";
      return [];
    }

    const leds = frame.map((f, i) => {
      const thisSection = sections[f.section];
      let index = f.row * thisSection.w + (f.col + 1);
      if (thisSection.serpentine) {
        const isOdd = !(f.row % 2);
        if (isOdd) {
          index = f.row * thisSection.w + (thisSection.w - f.col);
        }
      }
      const address = index + (thisSection.pixelOffset || 0) - 1;
      const lineEnd = i === frame.length - 1 ? "" : ",";
      goAddressString += `\n    ${address}${lineEnd}`;
      goColorString += `\n    color.RGBA{R: ${f.r}, G: ${f.g}, B: ${f.b}}${lineEnd}`;
      return [
        index + (thisSection.pixelOffset || 0) - 1,
        `color.RGBA{R: ${f.r}, G: ${f.g}, B: ${f.b}}`,
      ];
    });
    const lineEnd = fi === frames.length - 1 ? "}" : "},\n";

    goAddressString += lineEnd;
    goColorString += lineEnd;
    return leds;
  });
  goAddressString += "}";
  goColorString += "}";
  console.log({ pixels });
  const frameDelayString = `var FRAME_DELAY = ${frameDelay}`;
  return (
    <pre style={{ zIndex: 100 }}>
      <code>
        {frameDelayString + "\n" + goAddressString + "\n" + goColorString}
      </code>
    </pre>
  );
};
