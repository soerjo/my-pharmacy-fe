"use client";

import { useState } from "react";
import { UseFormRegister } from "react-hook-form";
import { TextField, Label, Description, InputGroup } from "@heroui/react";
import { cn } from "@/utils";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface QueantityInputProps {
  name: string;
  label: string;
  register: UseFormRegister<any>;
  placeholder?: string;
  error?: string;
  description?: string;
  required?: boolean;
}

export function QueantityInput({
  name,
  label,
  register,
  placeholder = "",
  error,
  description,
  required,
}: QueantityInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <TextField name={name} className="w-fit">
      <Label isRequired={required}>{label}</Label>
      <InputGroup>
        <InputGroup.Input

          // type={showPassword ? "text" : "password"}
          type="number"
          min={1}
          placeholder={placeholder}
          className={cn(error && "border-danger", "max-w-15")}
          {...register(name)}
        />
        <InputGroup.Suffix>
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            // className="focus:outline-none"
          >
            {showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-default-400"
              >
                <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                <line x1="2" x2="22" y1="2" y2="22" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-default-400"
              >
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </InputGroup.Suffix>
      </InputGroup>
      {description && <Description>{description}</Description>}
      {error && <Description className="text-danger">{error}</Description>}
    </TextField>
  );
}
