import { nanoid } from "nanoid";
import pino from "pino";
import httpLogger from "pino-http";
// import { createWriteStream } from "pino-http-send";
// @ts-expect-error - pino-noir has no types
import noir from "pino-noir";

import env from "./env";

const magentaCode = "\x1b[45m";
const italicsCode = "\x1b[3m";
const resetCode = "\x1b[0m";
export function stdWarn(text: string, n: boolean = true) {
  const textLength = text.length + 1;
  const stdOutWidth =
    parseInt(process.env.COLUMNS ?? `${process.stdout.columns}`, 10) - 6;
  const spaceAmount = Math.min(textLength, stdOutWidth);
  const warning = [];
  if (textLength > stdOutWidth) {
    const splitText = text.match(new RegExp(`.{1,${spaceAmount - 5}}`, "g"));
    if (splitText) {
      warning.push(
        ...splitText.map((t) => `  ${t}`.padEnd(spaceAmount - 1, " ")),
      );
    }
  } else {
    warning.push(`  ${text}  `);
  }

  const newLine = `  ${magentaCode}${new Array(
    textLength > stdOutWidth ? spaceAmount : textLength + 4,
  ).join(" ")}${resetCode}`;
  console.info();
  console.warn(newLine);
  warning.forEach((line) =>
    console.warn(`  ${magentaCode}${italicsCode}${line}${resetCode}`),
  );
  console.warn(newLine);
  if (n) console.info();
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
