"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, TextArea } from "@heroui/react";
import { createAdmissionSchema, type CreateAdmissionFormValues, type Admission } from "@/types";
import { useAdmissions } from "@/hooks/use-admissions";
import { PatientAutocomplete, WardAutocomplete } from "@/components/ui";

function getTodayDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

interface AdmissionFormProps {
  admission?: Admission;
  onClose: () => void;
  formId: string;
}

export function AdmissionForm({ admission, onClose, formId }: AdmissionFormProps) {
  const { createAdmission, updateAdmission } = useAdmissions();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const isEditing = !!admission;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateAdmissionFormValues>({
    resolver: zodResolver(createAdmissionSchema),
    defaultValues: admission
      ? {
          patientId: admission.patientId,
          wardId: admission.wardId,
          diagnosis: admission.diagnosis ?? "",
          admissionDate: admission.admissionDate?.split("T")[0] ?? "",
          notes: admission.notes ?? "",
        }
      : {
          patientId: "",
          wardId: "",
          diagnosis: "",
          admissionDate: getTodayDate(),
          notes: "",
        },
  });

  async function onSubmit(data: CreateAdmissionFormValues) {
    setSubmitError(null);
    try {
      if (isEditing && admission) {
        await updateAdmission(admission.id, data);
      } else {
        await createAdmission(data);
      }
      onClose();
    } catch {
      setSubmitError(
        isEditing
          ? "Failed to update admission. Please try again."
          : "Failed to create admission. Please try again.",
      );
    }
  }

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Controller
            name="patientId"
            control={control}
            render={({ field }) => (
              <PatientAutocomplete
                selectedKey={field.value || null}
                onSelectionChange={(key) => field.onChange(key)}
                label="Patient"
                placeholder="Search patients..."
                required
                error={errors.patientId?.message}
              />
            )}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Controller
            name="wardId"
            control={control}
            render={({ field }) => (
              <WardAutocomplete
                selectedKey={field.value || null}
                onSelectionChange={(key) => field.onChange(key)}
                label="Ward"
                placeholder="Search wards..."
                required
                error={errors.wardId?.message}
              />
            )}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="admissionDate" className="text-sm font-medium">
            Admission Date <span className="text-danger">*</span>
          </label>
          <Input
            id="admissionDate"
            type="date"
            {...register("admissionDate")}
          />
          {errors.admissionDate && (
            <p className="text-sm text-danger">{errors.admissionDate.message}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="diagnosis" className="text-sm font-medium">
          Diagnosis
        </label>
        <TextArea
          id="diagnosis"
          placeholder="Enter diagnosis (optional)"
          {...register("diagnosis")}
        />
        {errors.diagnosis && (
          <p className="text-sm text-danger">{errors.diagnosis.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="notes" className="text-sm font-medium">
          Notes
        </label>
        <TextArea
          id="notes"
          placeholder="Enter additional notes (optional)"
          {...register("notes")}
        />
      </div>

      {submitError && <p className="text-sm text-danger">{submitError}</p>}
    </form>
  );
}
