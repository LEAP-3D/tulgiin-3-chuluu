export function getAuthErrorMessage(err: unknown, fallback: string): string {
  if (typeof err === "string") return err;
  if (!err || typeof err !== "object") return fallback;

  const maybeErr = err as {
    message?: string;
    errors?: { longMessage?: string; message?: string }[];
  };

  if (Array.isArray(maybeErr.errors) && maybeErr.errors.length > 0) {
    const joined = maybeErr.errors
      .map((e) => e.longMessage ?? e.message)
      .filter(Boolean)
      .join("\n");
    if (joined) return joined;
  }

  if (typeof maybeErr.message === "string") return maybeErr.message;
  return fallback;
}
