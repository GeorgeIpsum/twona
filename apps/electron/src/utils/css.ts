import { cx } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

export const cn = (...classes: (string | undefined)[]) =>
  twMerge(cx(...classes));
