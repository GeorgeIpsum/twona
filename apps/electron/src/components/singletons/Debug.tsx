import { useControls } from "leva";

import { useTheme } from "~/features/theme";

const Debug: React.FC = () => {
  const { theme, setTheme } = useTheme();
  useControls({
    darkMode: {
      onChange: setTheme,
      options: ["light", "dark", "system"],
      value: theme,
      disabled: false,
      label: "Dark Mode",
    },
  });

  return null;
};

export default Debug;
