import React, { useEffect, useState } from "react";
import {
  Box,
  Image,
  Popover,
  Button,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
  InputGroup,
  InputLeftAddon,
  Input,
  InputRightAddon,
  Stack,
  FormControl,
  FormLabel,
  Switch,
  ButtonGroup,
  IconButton,
} from "@chakra-ui/react";
import { IoIosPlay, IoIosSquare, IoIosPause } from "react-icons/io";
import { useStore } from "../state";
import { useWindowSize } from "@react-hook/window-size/throttled";
import { EnabledLeds } from "./EnabledLeds";
import { SketchPicker } from "react-color";

const FramePreview = ({ width, index }) => {
  const {
    [`display.frameImages.${index}`]: frameImage,
    "display.currentFrame": currentFrame,
    "project.frames": frames,
    set,
  } = useStore([
    "display.currentFrame",
    `display.frameImages.${index}`,
    "set",
    "project.frames",
  ]);
  console.log({ frames });
  return (
    <Box
      flexShrink={0}
      key={`framePreview-${index}`}
      borderWidth={currentFrame === index ? 2 : 1}
      borderRadius="8px"
      height="100%"
      width={`${width}px`}
      borderColor={currentFrame === index ? "green.500" : undefined}
      cursor="pointer"
      onClick={() => {
        set("display.currentFrame", index);
      }}
      position="relative"
      _hover={{
        borderColor: currentFrame === index ? "green.500" : "blue.500",
      }}
    >
      {frames.length > 1 && (
        <Box
          borderWidth="1px"
          width="32px"
          height="32px"
          position="absolute"
          display="flex"
          alignItems="center"
          justifyContent="center"
          right="8px"
          top="8px"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            const newFrames = [...frames];
            newFrames.splice(index, 1);
            if (currentFrame === index && index !== 0) {
              set("display.currentFrame", currentFrame - 1);
            }
            set("project.frames", newFrames);
          }}
          borderRadius="4px"
          _hover={{
            borderColor: "red.500",
          }}
        >
          x
        </Box>
      )}
      {frameImage && <Image width="100%" height="100%" src={frameImage} />}
    </Box>
  );
};

export const TimelineMenu = () => {
  const {
    "project.frames": frames,
    "project.frameDelay": frameDelay,
    "project.looping": looping,
    "display.frameImages": frameImages,
    "display.currentFrame": currentFrame,
    "display.currentColor": currentColor,
    "display.ledSize": ledSize,
    "display.isPlaying": isPlaying,
    set,
  } = useStore([
    `project.frames`,
    "project.frameDelay",
    "project.looping",
    "display.currentFrame",
    "display.currentColor",
    "display.frameImages",
    "display.ledSize",
    "display.isPlaying",
    "set",
  ]);

  useEffect(() => {
    if (!isPlaying) return;
    const playDelay = setTimeout(() => {
      if (currentFrame === frames.length - 1) {
        if (!looping) {
          set("display.isPlaying", false);
          return;
        }
        set("display.currentFrame", 0);
        return;
      }
      set("display.currentFrame", currentFrame + 1);
    }, frameDelay);
    return () => {
      clearTimeout(playDelay);
    };
  }, [isPlaying, set, frameDelay, frames.length, currentFrame, looping]);

  const [winWidth, winHeight] = useWindowSize();
  const [width, setWidth] = useState(10);
  const height = 224;
  useEffect(() => {
    setWidth((height * winWidth) / (winHeight - 348));
  }, [winWidth, winHeight, setWidth]);

  console.log({ currentFrame, frameImages });
  return (
    <Box
      width="100%"
      height="240px"
      borderTopWidth="1px"
      position="absolute"
      bottom="64px"
      left={0}
      display="flex"
      flexDirection="row"
    >
      <Box flex={1} borderRightWidth={1} flexShrink={0}>
        <EnabledLeds currentFrame={currentFrame} />
      </Box>
      <Box
        flex={3}
        overflowX="auto"
        borderRightWidth={1}
        display="flex"
        flexDirection="row"
        padding="8px"
        justifyContent="center"
        gap="8px"
      >
        {frames.map((f, index, arr) => {
          console.log({ f, index });
          return (
            <>
              <FramePreview width={width} index={index} />
              <Box
                flexShrink={0}
                height="100%"
                width="32px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                borderWidth="1px"
                borderRadius="8px"
                cursor="pointer"
                _hover={{
                  borderColor: "blue.500",
                }}
                onClick={() => {
                  const newFrames = [...frames];
                  newFrames.splice(index + 1, 0, []);
                  set("project.frames", newFrames);
                }}
              >
                +
              </Box>
            </>
          );
        })}
      </Box>
      <Stack spacing={3} flex={1} flexShrink={0} p="8px">
        <ButtonGroup size="sm" isAttached variant="outline">
          <IconButton
            aria-label={isPlaying ? "Pause frames" : "Play frames"}
            onClick={() => {
              set("display.isPlaying", !isPlaying);
            }}
            icon={isPlaying ? <IoIosPause /> : <IoIosPlay />}
          />
          <IconButton
            isDisabled={!isPlaying}
            aria-label="Stop frames"
            icon={<IoIosSquare />}
            onClick={() => {
              set("display.currentFrame", 0);
              set("display.isPlaying", false);
            }}
          />
        </ButtonGroup>
        <Popover>
          <PopoverTrigger>
            <Button size="sm">
              Color{" "}
              <Box
                ml="8px"
                width="10px"
                height="10px"
                background={`rgb(${currentColor.r},${currentColor.g},${currentColor.b})`}
              />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverBody>
              <SketchPicker
                disableAlpha
                width="275px"
                onChangeComplete={(color, event) => {
                  set("display.currentColor", color.rgb);
                }}
                color={currentColor}
              />
            </PopoverBody>
          </PopoverContent>
        </Popover>
        <InputGroup size="sm">
          <InputLeftAddon children="Frame Delay" />
          <Input
            placeholder="300"
            value={frameDelay}
            onChange={(e) => {
              set("project.frameDelay", Number(e.target.value));
            }}
          />
          <InputRightAddon children="ms" />
        </InputGroup>
        ledSize
        <InputGroup size="sm">
          <InputLeftAddon children="Led Size" />
          <Input
            placeholder="32"
            value={ledSize}
            onChange={(e) => {
              set("display.ledSize", Number(e.target.value));
            }}
          />
          <InputRightAddon children="px" />
        </InputGroup>
        <FormControl display="flex" alignItems="center">
          <FormLabel htmlFor="looping" mb="0">
            Looping
          </FormLabel>
          <Switch
            id="looping"
            isChecked={looping}
            onChange={(e) => {
              set("project.looping", e.target.checked);
            }}
          />
        </FormControl>
      </Stack>
    </Box>
  );
};
