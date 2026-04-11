"use client";

import { useCallback, useState } from "react";

type BooleanToggle = [boolean, () => void, (value: boolean) => void];

export function useToggle(initial = false): BooleanToggle {
  const [value, setValue] = useState(initial);
  const toggle = useCallback(() => setValue((v) => !v), []);
  return [value, toggle, setValue];
}
