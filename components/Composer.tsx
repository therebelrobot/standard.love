import { Box } from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
// import Konva from "konva";
import { Stage, Layer, Rect, Text, Group, Circle } from "react-konva";
import { useStore } from "../state";
import { GRID } from "./constants";
import { EnabledLeds } from "./EnabledLeds";
import { TimelineMenu } from "./TimelineMenu";
import { UploadDropzone } from "./UploadDropzone";

const Pixel = ({ currentFrame, section, index }) => {
  const {
    [`project.frames.${currentFrame}`]: rawpixels,
    "display.ledSize": ledSize,
    "display.currentColor": currentColor,
    set,
  } = useStore([
    `project.frames.${currentFrame}`,
    "display.ledSize",
    "set",
    "display.currentColor",
  ]);
  const pixels = rawpixels || [];
  const row = Math.floor(index / section.w);
  const col =
    section.reverse && !(row % 2) // if reverse and odd
      ? index % section.w
      : section.reverse // if reverse
      ? section.w - (index % section.w) - 1
      : section.serpentine && !(row % 2) // if forward and odd
      ? section.w - (index % section.w) - 1
      : index % section.w; // if forward

  let isLit = true;
  let thisPixel = pixels.filter(
    (p) => p.section === section.id && p.row === row && p.col === col
  )[0];
  if (!thisPixel) {
    isLit = false;
    thisPixel = {
      section: section.id,
      row,
      col,
      r: 225,
      g: 225,
      b: 225,
    };
  }

  const x = (thisPixel.col + 1) * ledSize - 0.5 * ledSize;
  const y = thisPixel.row * ledSize + 0.5 * ledSize;
  return (
    <>
      <Text
        text={index + (section.pixelOffset || 0)}
        x={x - 0.25 * ledSize}
        y={y - 0.15 * ledSize}
        align="center"
        fill="#555"
        isInteractable={false}
      />
      <Circle
        fill={`rgba(${thisPixel.r}, ${thisPixel.g}, ${thisPixel.b}, 0.75)`}
        width={0.8 * ledSize}
        height={0.8 * ledSize}
        x={x}
        y={y}
        onMouseEnter={(e) => {
          // style stage container:
          const container = e.target.getStage().container();
          container.style.cursor = "pointer";
        }}
        onMouseLeave={(e) => {
          const container = e.target.getStage().container();
          container.style.cursor = "default";
        }}
        onClick={() => {
          console.log("clicked!", section.id, row, col, index, { isLit });
          let newPixels = [...pixels];
          if (isLit) {
            newPixels = pixels.filter(
              (p) =>
                !(p.section === section.id && p.row === row && p.col === col)
            );
          } else {
            newPixels = [...pixels, { ...thisPixel, ...currentColor }];
          }
          set(`project.frames.${currentFrame}`, newPixels);
        }}
      />
    </>
  );
};

const PixelList = ({ sectionIndex }) => {
  const {
    [`project.sections.${sectionIndex}`]: section,
    "display.currentFrame": currentFrame,
  } = useStore(["display.currentFrame", `project.sections.${sectionIndex}`]);
  const totalPixels = section.w * section.h || 0;
  return (
    <>
      {[...Array(totalPixels).keys()].map((_, index) => (
        <Pixel
          key={`pixel-${section.id}-${index}`}
          index={index}
          section={section}
          currentFrame={currentFrame}
        />
      ))}
    </>
  );
};

const Section = ({ index }) => {
  const {
    "project.sections": sections,
    [`project.sections.${index}`]: section,
    "display.ledSize": ledSize,
    "display.currentFrame": currentFrame,
    set,
  } = useStore([
    "project.sections",
    `project.sections.${index}`,
    "display.ledSize",
    "display.currentFrame",
    "set",
  ]);

  const totalPixels = sections
    .map((s) => s.h * s.w)
    .reduce((pv, cv) => pv + cv, 0);

  useEffect(() => {
    if (!section || index === 0) return;
    const offset = [...Array(index).keys()]
      .map((s) => sections[s].h * sections[s].w)
      .reduce((pv, cv) => pv + cv, 0);
    console.log({ section: section.id, offset });
    set(`project.sections.${index}.pixelOffset`, offset);
  }, [sections.length, totalPixels, set, currentFrame]);

  const gridImg = new Image(32, 32);
  gridImg.src = GRID;

  return (
    <Group
      x={section.display.x * ledSize}
      y={section.display.y * ledSize}
      rotation={section.display.rotation}
    >
      <Rect
        width={section.w * ledSize}
        height={section.h * ledSize}
        stroke="black"
        fillPatternImage={gridImg}
        fillPatternScale={{
          x: (ledSize * 0.97) / 32,
          y: (ledSize * 0.97) / 32,
        }}
        onClick={(...args) => {
          console.log(args);
        }}
      />
      <PixelList sectionIndex={index} />
    </Group>
  );
};

// 32/0.97
// 42 / ??

const SectionList = () => {
  const { "project.sections": sections, "display.ledSize": ledSize } = useStore(
    ["project.sections", "display.ledSize"]
  );
  console.log("SectionList", sections, ledSize);
  return (
    <>
      {sections.map((section, index) => {
        return <Section index={index} key={`section-${section.id}`} />;
      })}
    </>
  );
};

export const Composer: React.FC = () => {
  const {
    "project.sections": sections,
    "display.currentFrame": currentFrame,
    set,
  } = useStore(["project.sections", "display.currentFrame", "set"]);
  const stageRef = React.useRef(null);

  useEffect(() => {
    const repeater = setInterval(() => {
      console.log("looping", stageRef);
      if (!stageRef.current) return;
      const image = stageRef.current.toDataURL();
      console.log({ image });
      set(`display.frameImages.${currentFrame}`, image);
    }, 1000);
    return () => {
      clearInterval(repeater);
    };
  }, [set, currentFrame]);

  console.log({ sections });
  return (
    <Box width="100vw" height="calc(100vh - 114px)">
      <UploadDropzone>
        <Stage
          ref={stageRef}
          width={window.innerWidth}
          height={window.innerHeight - 348}
        >
          <Layer>
            <SectionList />
          </Layer>
        </Stage>
        <TimelineMenu />
      </UploadDropzone>
    </Box>
  );
};
