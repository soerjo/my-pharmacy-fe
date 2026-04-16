"use client";

import { Alert, Button } from "@heroui/react";
import { useErrorAlert } from "@/providers/error-provider";

export function GlobalErrorAlert() {
  const { error, dismissError } = useErrorAlert();

  if (!error) return null;

  return (
    <div className="fixed top-4 right-4 z-50 w-full max-w-md">
      <Alert
        key={error.key}
        status="danger"
        className="rounded-lg shadow-lg"
      >
        <Alert.Title>Something went wrong</Alert.Title>
        <Alert.Description>{error.message}</Alert.Description>
        <Button size="sm" variant="tertiary" onPress={dismissError}>
          Dismiss
        </Button>
      </Alert>
    </div>
  );
}
