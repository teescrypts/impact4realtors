import { createComponents } from "./create-components";
import { createPalette } from "./create-palette";
import { createShadows } from "./create-shadow";

export const createOptions = (config: {
  colorPreset: string;
  contrast: string;
}) => {
  const { colorPreset, contrast } = config;
  const palette = createPalette({ colorPreset, contrast });
  const components = createComponents();
  const shadows = createShadows();

  return {
    components,
    palette,
    shadows,
  };
};
