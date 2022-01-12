import { Button, ButtonGroup } from "@chakra-ui/react";
import React from "react";
import { useDropzone } from "react-dropzone";
import ab2str from "arraybuffer-to-string";
import YAML from "yaml";
import { useStore } from "../state";
import { saveAs } from "file-saver";

// import and parse config
export const UploadDropzone = ({ children }) => {
  const { setRoot } = useStore("setRoot");
  const { project, version, author } = useStore([
    "project",
    "version",
    "author",
  ]);

  const onDrop = React.useCallback(
    (acceptedFiles) => {
      acceptedFiles.forEach((file) => {
        const reader = new FileReader();

        reader.onabort = () => console.log("file reading was aborted");
        reader.onerror = () => console.log("file reading has failed");
        reader.onload = () => {
          // Do whatever you want with the file contents
          const binaryStr = reader.result;

          const text = ab2str(binaryStr);
          const config = YAML.parse(text);
          if (!config.frames) config.frames = [];
          if (!config.frames[0]) config.frames[0] = [];

          console.log(config);
          setRoot(config);
        };
        reader.readAsArrayBuffer(file);
      });
    },
    [setRoot]
  );
  const { getRootProps, getInputProps, open, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
  });

  return (
    <div
      {...getRootProps()}
      style={{
        width: "100%",
        height: "100%",
        background: `background: ${isDragActive ? "#858585cc" : "white"}`,
      }}
    >
      <input {...getInputProps()} />
      <ButtonGroup
        size="sm"
        isAttached
        variant="outline"
        position="absolute"
        zIndex={10}
        right="20px"
        top="70px"
      >
        <Button onClick={open}>Upload</Button>
        <Button
          onClick={() => {
            console.log("download");
            const doc = new YAML.Document();
            doc.contents = { version, author, project };
            const yamlString = doc.toString();
            var blob = new Blob([yamlString], {
              type: "application/x-yaml;charset=utf-8",
            });
            const d = new Date();
            const date = d.toISOString();
            saveAs(blob, `project-${date}.sled`);
          }}
        >
          Download
        </Button>
      </ButtonGroup>

      {children}
    </div>
  );
};
