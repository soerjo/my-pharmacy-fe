import { toast } from "@heroui/react";
import { ApiError } from "@/lib/api-client";

const MAX_MESSAGE_LENGTH = 200;

function sanitizeMessage(raw: string): string {
  const stripped = raw.replace(/<[^>]*>/g, "").trim();
  return stripped.length > MAX_MESSAGE_LENGTH
    ? `${stripped.slice(0, MAX_MESSAGE_LENGTH)}...`
    : stripped;
}

function extractServerMessage(error: ApiError): string {
  try {
    const parsed = JSON.parse(error.message);
    return parsed.message || parsed.error || parsed.msg || `Server Error (${error.status})`;
  } catch {
    return error.message
      ? sanitizeMessage(error.message)
      : `Server Error (${error.status})`;
  }
}

export function onServerError(error: unknown) {
  if (!(error instanceof ApiError)) return;
  const message = extractServerMessage(error);
  toast.danger("Error", { description: message });
}
