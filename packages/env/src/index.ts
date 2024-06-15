import "dotenv/config";
import { ZodSchema } from "zod";

type Primitive = string | number | boolean;
type TypedPrimitive = ["string" | "number" | "boolean", Primitive];
export type EnvInput = {
  [k: string]: Primitive | TypedPrimitive | ZodSchema;
};
interface EnvOpts {
  overrideEnv?: boolean;
  logAccess?: boolean;
}
interface PrimitiveMap {
  string: string;
  number: number;
  boolean: boolean;
}

export type Env<E extends EnvInput> = {
  [Key in keyof E]: E[Key] extends ZodSchema
    ? ReturnType<E[Key]["parse"]>
    : E[Key] extends TypedPrimitive
      ? PrimitiveMap[E[Key][0]]
      : E[Key] extends Primitive
        ? E[Key]
        : never;
};

type LogFunctions = "log" | "info" | "warn" | "error";
export const parseEnv = <E extends EnvInput>(
  env: E,
  opts: EnvOpts = { logAccess: false, overrideEnv: false },
  logger: { [Log in LogFunctions]: (...args: unknown[]) => void } = console,
): Env<E> => {
  const shouldLog = logger && opts.logAccess;
  if (shouldLog) {
    logger.info("Parsing env variables...");
  }
  const resolvedEnv = Object.fromEntries(
    Object.entries(env).map(([k, v]) => {
      let returnV;
      const existingEnvValue = process.env[k];
      if (Array.isArray(v)) {
        const [type, defaultValue] = v;
        if (type === "string") {
          returnV = existingEnvValue ?? defaultValue;
        } else if (type === "number") {
          const value = Number(existingEnvValue ?? v);
          if (isNaN(value)) {
            logger.error(`Invalid number value for env.${k}`);
            throw new Error(`Invalid number value for env.${k}`);
          }
        } else if (type === "boolean") {
          const value = Boolean(existingEnvValue ?? v);
          returnV = value;
        }
      } else if (v instanceof ZodSchema) {
        const { error, data, success } = v.safeParse(existingEnvValue);
        if (!success) {
          if (shouldLog && error) {
            logger.error(`Error parsing env.${k}: ${error.message}`);
          }
          throw error;
        }
        returnV = data;
      } else {
        if (typeof v === "string") {
          returnV = existingEnvValue ?? v;
        } else if (typeof v === "number") {
          returnV = Number(existingEnvValue ?? v);
        } else if (typeof v === "boolean") {
          returnV = (existingEnvValue ?? v) === "true";
        }
      }
      return [k, returnV];
    }),
  );

  return new Proxy(Object.freeze(resolvedEnv), {
    get(target, prop, receiver) {
      if (shouldLog) {
        logger.info(`Accessed env.${String(prop)}`);
      }
      return Reflect.get(target, prop, receiver);
    },
    set: () => false,
    defineProperty: () => false,
    deleteProperty: () => false,
  }) as Env<E>;
};
