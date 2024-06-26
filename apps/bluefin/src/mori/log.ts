import { nanoid } from "nanoid";
import pino from "pino";
import httpLogger from "pino-http";
// import { createWriteStream } from "pino-http-send";
// @ts-expect-error - pino-noir has no types
import noir from "pino-noir";

import env from "./env";

const TUI_ENABLED = !!process.env.TURBO_HASH;
const calcStdOutWidth = (margin: number) =>
  parseInt(process.env.COLUMNS ?? `${process.stdout.columns}`, 10) -
  margin * 2 -
  (TUI_ENABLED ? 32 : 0);

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
  return `${margin}${colorCode}${otherCodes.join("")}${italicsCode}${padding}${text.padEnd(length, ` `)}${padding}${resetCode}${margin}`;
};

const removeAnsi = (text: string) =>
  text.replace(
    /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
    "",
  );

const buildLines = (
  text: string,
  rowLength: number,
  wordBoundary = DEFAULT_WORD_BOUNDARY,
) => {
  const lines: string[] = [];
  const fmtText = removeAnsi(text);
  if (fmtText.length <= rowLength) {
    lines.push(fmtText);
  } else {
    const boundarySplit = fmtText.split(wordBoundary);
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
  const stdOutWidth = calcStdOutWidth(margin);
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

const skippedPaths = ["/health", "/favicon.ico"];
export const attachLogger = httpLogger({
  logger: log,
  genReqId: (req, res) => {
    const existing = req.headers["x-request-id"] ?? req.id;
    if (existing) return existing;
    if (req.url && req.url.length > 0) {
      const parsedUrl = req.url
        ?.split("?")[0]
        ?.replace("/", "")
        .replace(/\//g, ".");
      const id = nanoid(8);
      res.setHeader("x-request-id", id);
      return `${parsedUrl}|${req.method ?? "NO_METHOD"}|${id}`;
    }
    const id = nanoid();
    res.setHeader("x-request-id", id);
    return id;
  },
  name: "http",
  serializers: {
    req: (req) => {
      if (req.headers["x-wait-on-req"]) {
        return "Client will launch momentarily... 🚀";
      }
      if (skippedPaths.includes(req.url)) {
        return { id: req.id, remoteAddress: req.ip ?? req.remoteAddress };
      }
      return req;
    },
    res: (res) => {
      if (res.raw.req.headers["x-wait-on-req"]) {
        return undefined;
      }
      if (skippedPaths.includes(res.raw.req.baseUrl)) {
        return "ok";
      }
      return res;
    },
    ...redactedKeys,
  },
});

export default log;
