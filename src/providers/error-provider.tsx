"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ApiError } from "@/lib/api-client";

type ErrorState = {
  message: string;
  key: number;
} | null;

type ErrorContextValue = {
  error: ErrorState;
  showError: (message: string) => void;
  dismissError: () => void;
};

const ErrorContext = createContext<ErrorContextValue | null>(null);

const AUTO_DISMISS_MS = 8000;
const DEDUP_WINDOW_MS = 2000;
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

export function useErrorAlert() {
  const ctx = useContext(ErrorContext);
  if (!ctx) throw new Error("useErrorAlert must be used within ErrorProvider");
  return ctx;
}

export function ErrorProvider({ children }: { children: ReactNode }) {
  const [error, setError] = useState<ErrorState>(null);
  const lastMessageRef = useRef("");
  const lastMessageTimeRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showError = useCallback((message: string) => {
    const now = Date.now();
    if (
      message === lastMessageRef.current &&
      now - lastMessageTimeRef.current < DEDUP_WINDOW_MS
    ) {
      return;
    }
    lastMessageRef.current = message;
    lastMessageTimeRef.current = now;

    if (timerRef.current) clearTimeout(timerRef.current);

    setError((prev) => ({ message, key: prev ? prev.key + 1 : 0 }));

    timerRef.current = setTimeout(() => {
      setError(null);
      lastMessageRef.current = "";
      timerRef.current = null;
    }, AUTO_DISMISS_MS);
  }, []);

  const dismissError = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setError(null);
    lastMessageRef.current = "";
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <ErrorContext.Provider value={{ error, showError, dismissError }}>
      {children}
    </ErrorContext.Provider>
  );
}

export function onServerError(error: unknown) {
  if (!(error instanceof ApiError) || error.status < 500) return;
  const message = extractServerMessage(error);
  window.dispatchEvent(
    new CustomEvent("app:server-error", { detail: { message } }),
  );
}
