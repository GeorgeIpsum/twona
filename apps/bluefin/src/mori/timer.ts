import log from "./log";

// TODO: add breakpoint/ breadcrumb handling, full function composability, report generation
export const hrtime = (
  timer?: bigint,
  logText?: string,
  timerKey = "timer",
) => {
  if (timer) {
    const diff = process.hrtime.bigint() - timer;
    if (logText) {
      log.info({ [timerKey]: `${diff / BigInt(1e6)}ms` }, logText);
    }
    return diff;
  }
  return process.hrtime.bigint();
};

export const timer = () => {
  const startTime = hrtime();

  return {
    startTime,
    time: (logText?: string, timerKey = "timer") => {
      return hrtime(startTime, logText, timerKey);
    },
  };
};
