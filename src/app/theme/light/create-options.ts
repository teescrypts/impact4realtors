import { createComponents } from "./create-components";
import { createPalette } from "./create-palette";
import { createShadows } from "./create-shadows";

export const createOptions = ({
  colorPreset,
  contrast,
}: {
  colorPreset: string;
  contrast: string;
}) => {
  const palette = createPalette({ colorPreset, contrast });
  const components = createComponents();
  const shadows = createShadows();

  return {
    components,
    palette,
    shadows,
  };
};
