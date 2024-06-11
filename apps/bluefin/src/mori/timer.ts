import log from "./log";

export const timer = (timer?: bigint, logText?: string, logger = log) => {
  if (timer) {
    const diff = process.hrtime.bigint() - timer;
    if (logText) {
      logger.info({ time: (diff / BigInt(1e6)).toString() }, logText);
    }
    return diff;
  }
  return process.hrtime.bigint();
};
