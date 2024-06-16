import { nativeTheme } from "electron";

export type Theme = typeof nativeTheme.themeSource;

export const getNativeTheme = () => nativeTheme.themeSource;

export const setNativeTheme = (theme: Theme) => {
  nativeTheme.themeSource = theme;
};
