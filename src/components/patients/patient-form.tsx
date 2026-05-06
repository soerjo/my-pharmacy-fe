"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, TextArea, Spinner } from "@heroui/react";
import { patientSchema, type PatientFormValues } from "@/types";
import { GENDER_VALUES } from "@/types";
import { usePatients, usePatient } from "@/hooks/use-patients";
import { cn } from "@/utils";

interface PatientFormProps {
  patientId?: string;
  onClose: () => void;
  formId: string;
  onDirtyChange?: (dirty: boolean) => void;
  onSubmittingChange?: (submitting: boolean) => void;
}

const EMPTY_DEFAULTS: PatientFormValues = {
  mrn: "",
  name: "",
  dateOfBirth: "",
  gender: "",
  phone: "",
  address: "",
  allergies: "",
  notes: "",
};

export function PatientForm({ patientId, onClose, formId, onDirtyChange, onSubmittingChange }: PatientFormProps) {
  const { createPatient, updatePatient } = usePatients();
  const { patient: patientDetail, isLoading: isLoadingDetail } = usePatient(patientId ?? "");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const isEditing = !!patientId;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: EMPTY_DEFAULTS,
  });

  useEffect(() => {
    if (isEditing && patientDetail) {
      reset({
        mrn: patientDetail.mrn,
        name: patientDetail.name,
        dateOfBirth: patientDetail.dateOfBirth ? patientDetail.dateOfBirth.split("T")[0] : "",
        gender: patientDetail.gender ?? "",
        phone: patientDetail.phone ?? "",
        address: patientDetail.address ?? "",
        allergies: patientDetail.allergies ?? "",
        notes: patientDetail.notes ?? "",
      });
    }
  }, [isEditing, patientDetail, reset]);

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  async function onSubmit(data: PatientFormValues) {
    setSubmitError(null);
    const payload = {
      ...data,
      phone: data.phone || undefined,
      address: data.address || undefined,
      allergies: data.allergies || undefined,
      notes: data.notes || undefined,
    };

    try {
      onSubmittingChange?.(true);
      if (isEditing && patientId) {
        await updatePatient(patientId, payload);
      } else {
        await createPatient(payload);
      }
      onDirtyChange?.(false);
      onClose();
    } catch {
      onSubmittingChange?.(false);
      setSubmitError(
        isEditing
          ? "Failed to update patient. Please try again."
          : "Failed to create patient. Please try again.",
      );
    }
  }

  if (isEditing && isLoadingDetail) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-8">
        <Spinner size="lg" />
        <p className="text-sm text-zinc-500">Loading patient data...</p>
      </div>
    );
  }

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="mrn" className="text-sm font-medium">
            MRN <span className="text-danger">*</span>
          </label>
          <Input
            id="mrn"
            placeholder="Enter MRN"
            {...register("mrn")}
          />
          {errors.mrn && (
            <p className="text-sm text-danger">{errors.mrn.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-sm font-medium">
            Name <span className="text-danger">*</span>
          </label>
          <Input
            id="name"
            placeholder="Enter patient name"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-sm text-danger">{errors.name.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="dateOfBirth" className="text-sm font-medium">
            Date of Birth <span className="text-danger">*</span>
          </label>
          <Input
            id="dateOfBirth"
            type="date"
            {...register("dateOfBirth")}
          />
          {errors.dateOfBirth && (
            <p className="text-sm text-danger">{errors.dateOfBirth.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="gender" className="text-sm font-medium">
            Gender <span className="text-danger">*</span>
          </label>
          <select
            id="gender"
            {...register("gender")}
            className={cn(
              "flex h-9 w-full rounded-lg border border-default-300 bg-transparent px-3 py-1 text-sm shadow-sm outline-none transition-colors",
              "focus:border-primary focus:ring-1 focus:ring-primary",
              "data-[hover=true]:border-default-400",
              "dark:border-default-200",
            )}
          >
            <option value="">Select gender</option>
            {GENDER_VALUES.map((g) => (
              <option key={g} value={g}>
                {g.charAt(0) + g.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
          {errors.gender && (
            <p className="text-sm text-danger">{errors.gender.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="phone" className="text-sm font-medium">
            Phone
          </label>
          <Input
            id="phone"
            placeholder="Enter phone number"
            {...register("phone")}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="address" className="text-sm font-medium">
            Address
          </label>
          <Input
            id="address"
            placeholder="Enter address"
            {...register("address")}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="allergies" className="text-sm font-medium">
          Allergies
        </label>
        <TextArea
          id="allergies"
          placeholder="Enter known allergies"
          {...register("allergies")}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="notes" className="text-sm font-medium">
          Notes
        </label>
        <TextArea
          id="notes"
          placeholder="Enter additional notes"
          {...register("notes")}
        />
      </div>

      {submitError && <p className="text-sm text-danger">{submitError}</p>}
    </form>
  );
}
