import create from "zustand";
import obj from "object-path";
import setValue from "set-value";
import shallow from "zustand/shallow";

const defaultState = {
  display: {
    ledSize: 32,
    currentFrame: 0,
    frameImages: {},
    currentColor: {
      r: "200",
      g: "0",
      b: "0",
    },
  },
  version: "v0.0.1-alpha",
  author: "Aster (@therebelrobot)",
  project: {
    frameDelay: 300,
    looping: true,
    frameDrop: true,
    sections: [
      {
        id: 0,
        h: 8,
        w: 8,
        serpentine: true,
        display: {
          x: 14,
          y: 5,
          rotation: 0,
        },
      },
      {
        id: 1,
        h: 8,
        w: 8,
        serpentine: true,
        display: {
          x: 1,
          y: 5,
          rotation: 10,
        },
      },
    ],
    frames: [
      [
        {
          section: 0,
          row: 0,
          col: 0,
          r: 255,
          g: 255,
          b: 0,
        },
        {
          section: 0,
          row: 1,
          col: 0,
          r: 255,
          g: 255,
          b: 0,
        },
        {
          section: 1,
          row: 2,
          col: 0,
          r: 0,
          g: 255,
          b: 0,
        },
      ],
      [
        {
          section: 0,
          row: 0,
          col: 0,
          r: 255,
          g: 255,
          b: 0,
        },
        {
          section: 0,
          row: 1,
          col: 0,
          r: 255,
          g: 255,
          b: 0,
        },
        {
          section: 1,
          row: 2,
          col: 0,
          r: 255,
          g: 255,
          b: 0,
        },
      ],
    ],
  },
};

export const useStoreRaw = create((set) => ({
  ...defaultState,
  set: (path, value) => {
    return set((state) => {
      const newState = setValue({ ...state }, path, value);
      return newState;
    });
  },
  setRoot: (value) => {
    return set((state) => ({ ...state, ...value }));
  },
}));

export const useStore = (paths) => {
  if (!Array.isArray(paths)) paths = [paths];

  return useStoreRaw((state) => {
    const returnState = {};
    for (const path of paths) {
      returnState[path] = obj.get(state, path);
    }
    return returnState;
  }, shallow);
};
