type LogLevel = "debug" | "info" | "warn" | "error";

type LogContext = Record<string, unknown>;

/**
 * Structured logging for both Node and Edge runtimes (no external
 * dependency, no side effects at import time). Emits one JSON line per call
 * so Vercel's log drain / log viewer can filter and search on `level` and
 * `context` fields instead of parsing free-form strings.
 *
 * Not a request-scoped/correlation-ID logger — this app doesn't have a
 * request-tracing need yet. Add one if that changes.
 */
function serializeContext(context?: LogContext): LogContext | undefined {
  if (!context) return undefined;
  const serialized: LogContext = {};
  for (const [key, value] of Object.entries(context)) {
    serialized[key] =
      value instanceof Error
        ? { name: value.name, message: value.message, stack: value.stack }
        : value;
  }
  return serialized;
}

function emit(level: LogLevel, message: string, context?: LogContext) {
  const entry = {
    level,
    message,
    time: new Date().toISOString(),
    ...(context ? { context: serializeContext(context) } : {}),
  };
  const line = JSON.stringify(entry);
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

export const logger = {
  debug(message: string, context?: LogContext) {
    if (process.env.NODE_ENV !== "production") emit("debug", message, context);
  },
  info(message: string, context?: LogContext) {
    emit("info", message, context);
  },
  warn(message: string, context?: LogContext) {
    emit("warn", message, context);
  },
  error(message: string, context?: LogContext) {
    emit("error", message, context);
  },
};
