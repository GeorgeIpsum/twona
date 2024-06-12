import { nanoid } from "nanoid";
import pino from "pino";
import httpLogger from "pino-http";
// import { createWriteStream } from "pino-http-send";
// @ts-expect-error - pino-noir has no types
import noir from "pino-noir";

import env from "./env";

const TUI_ENABLED = !!process.env.TURBO_HASH;

interface StdWarnOpts {
  wordBoundary?: string;
  newLine?: boolean;
  margin?: number;
  padding?: number;
}

type StdWarnText = {
  header?: string;
  text: string | string[];
};

const DEFAULT_WORD_BOUNDARY = " ";
const DEFAULT_BOX_MARGIN = 3;
const DEFAULT_BOX_PADDING = 2;
const DEFAULT_STD_WARN_OPTS: StdWarnOpts = {
  wordBoundary: DEFAULT_WORD_BOUNDARY,
  margin: DEFAULT_BOX_MARGIN,
  padding: DEFAULT_BOX_PADDING,
  newLine: true,
};

const boldCode = "\x1b[1m";
const boldBriteCode = "\x1b[1;97;104m";
const magentaCode = "\x1b[45m";
const italicsCode = "\x1b[3m";
const resetCode = "\x1b[0m";

// TODO: make this work
export const bold = (text: string, reset = true) =>
  `${boldCode}${text}${reset ? resetCode : ""}`;
export const italicize = (text: string, reset = true) =>
  `${italicsCode}${text}${reset ? resetCode : ""}`;

const renderText = (
  text: string,
  length: number,
  colorCode = magentaCode,
  marginLength = DEFAULT_BOX_MARGIN,
  paddingLength = DEFAULT_BOX_PADDING,
  ...otherCodes: string[]
) => {
  const margin = new Array(marginLength).fill(" ").join("");
  const padding = new Array(paddingLength).fill(" ").join("");
  return `${margin}${colorCode}${otherCodes.join("")}${italicsCode}${padding}${text.padEnd(length, " ")}${padding}${resetCode}${margin}`;
};

const buildLines = (
  text: string,
  rowLength: number,
  wordBoundary = DEFAULT_WORD_BOUNDARY,
) => {
  const lines: string[] = [];
  if (text.length <= rowLength) {
    lines.push(text);
  } else {
    const boundarySplit = text.split(wordBoundary);
    boundarySplit.reduce((w, word) => {
      const currentIndex = Math.max(w.length - 1, 0);
      let currentLine = w[currentIndex] ?? "";
      if (currentLine.length + word.length < rowLength) {
        currentLine += `${word}${wordBoundary}`;
      } else {
        w.push(`${word}${wordBoundary}`);
      }
      w[currentIndex] = currentLine;
      return w;
    }, lines);
  }
  return lines;
};

export function stdWarn(
  stdWarnText: string | StdWarnText,
  {
    wordBoundary = DEFAULT_WORD_BOUNDARY,
    newLine = true,
    margin = DEFAULT_BOX_MARGIN,
    padding = DEFAULT_BOX_PADDING,
  }: StdWarnOpts = DEFAULT_STD_WARN_OPTS,
) {
  const stdOutWidth =
    parseInt(process.env.COLUMNS ?? `${process.stdout.columns}`, 10) -
    margin * 2 -
    (TUI_ENABLED ? 18 : 0);
  const rowLength = stdOutWidth - padding * 2;

  const standardText: StdWarnText =
    typeof stdWarnText === "string"
      ? {
          text: stdWarnText,
        }
      : stdWarnText;

  const { header, text } = standardText;

  const buildStdWarnLines = (text: string) =>
    buildLines(text, rowLength, wordBoundary);

  const texts = Array.isArray(text) ? text : text.length ? [text] : [];

  const warnings: string[] = [];
  let numHeaderLines = 0;
  if (header) {
    const headerLines = buildStdWarnLines(header);
    numHeaderLines = headerLines.length;
    warnings.push(...headerLines);
    if (texts.length) warnings.push("");
  }

  if (texts.length > 1) {
    texts.forEach((t) => {
      warnings.push(...buildStdWarnLines(t));
      // if (i < texts.length - 1) warnings.push("");
    });
  } else if (texts.length === 1) {
    warnings.push(...buildLines(texts[0]!, rowLength, wordBoundary));
  }

  const boundWarning = ["", ...warnings, ""];
  const warningText = boundWarning
    .map((line, i) =>
      renderText(
        line.trimEnd(),
        rowLength,
        magentaCode,
        margin,
        padding,
        header && i <= numHeaderLines ? boldBriteCode : boldCode,
      ),
    )
    .join("\n");

  console.warn(newLine ? `\n${warningText}\n` : warningText);
  return;
}

const COLORS = {
  yellow: 33,
  green: 32,
  blue: 34,
  red: 31,
  grey: 90,
  magenta: 35,
  clear: 39,
};

export const colorize = (color: keyof typeof COLORS, string?: string) =>
  `\u001b[${COLORS[color]}m${string}\u001b[${COLORS.clear}m`;

// nested keys follow {key}.{nested key} format (aka jsonpath)
const redactedKeys = noir(
  ["password", "token", "secret", "key"],
  ["_|REDACTED|_"],
);

const log = pino(
  {
    transport: env.dev
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
          },
        }
      : undefined,
    serializers: redactedKeys,
    level: env.debug ? "debug" : "info",
  },
  pino.multistream([{ stream: process.stdout }]),
);

export const attachLogger = httpLogger({
  logger: log,
  genReqId: () => nanoid(),
  name: "http",
});

export default log;
