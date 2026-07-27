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

/**
 * Next.js signals "this route needs dynamic rendering" by throwing a
 * special internal error (digest starting with DYNAMIC_SERVER_USAGE, or —
 * across versions — a "Dynamic server usage" message) during its static-
 * generation probe. Broad try/catch blocks around cookies()-based calls
 * (auth/session reads, settings lookups) inevitably catch this too; it
 * isn't a real failure, just Next.js finding out a page can't be static.
 * Downgrading it to debug keeps genuine Supabase/query errors visible at
 * error level without this expected, per-build noise drowning them out.
 */
function isDynamicServerUsageSignal(context?: LogContext): boolean {
  const error = context?.error;
  if (!error || typeof error !== "object") return false;
  const digest = (error as { digest?: unknown }).digest;
  if (typeof digest === "string" && digest.startsWith("DYNAMIC_SERVER_USAGE")) return true;
  const message = (error as { message?: unknown }).message;
  return typeof message === "string" && message.startsWith("Dynamic server usage:");
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
    if (isDynamicServerUsageSignal(context)) {
      if (process.env.NODE_ENV !== "production") emit("debug", message, context);
      return;
    }
    emit("error", message, context);
  },
};
