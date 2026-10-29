/** Redact complete responses before any local line or character truncation. */
export function redactLog(text: string, secrets: ReadonlyArray<string> = []): string {
  let safe = text.replace(/\u001b\[[0-9;]*[a-zA-Z]/g, "");
  for (const secret of [...secrets].filter(Boolean).sort((a, b) => b.length - a.length))
    safe = safe.split(secret).join("[REDACTED]");
  return (
    safe
      // Cover generated connection strings even when their resolved secrets are unknown.
      .replace(/\b[a-z][a-z0-9+.-]*:\/\/[^\s<>"'/?#]*@[^\s<>"']*/gi, "[URL REDACTED]")
      .replace(/https?:\/\/[^\s<>"']+/gi, "[URL REDACTED]")
      .replace(/\bBearer\s+\S+/gi, "Bearer [REDACTED]")
      .replace(
        /\b(\w*(?:token|password|secret|authorization|api_key)\w*)\s*[:=]\s*[^\s,;]+/gi,
        "$1=[REDACTED]",
      )
  );
}

/** Bound user-visible diagnostics only after removing whole, possibly multiline secrets. */
export const redactDeployLog = (text: string, secrets: ReadonlyArray<string> = []) =>
  redactLog(text, secrets).split("\n").slice(-80).join("\n").slice(-8000);
