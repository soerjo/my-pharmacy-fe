"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, TextArea } from "@heroui/react";
import { patientSchema, type PatientFormValues, type Patient } from "@/types";
import { GENDER_VALUES } from "@/types";
import { usePatients } from "@/hooks/use-patients";
import { cn } from "@/utils";

interface PatientFormProps {
  patient?: Patient;
  onClose: () => void;
  formId: string;
}

export function PatientForm({ patient, onClose, formId }: PatientFormProps) {
  const { createPatient, updatePatient } =
    usePatients();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const isEditing = !!patient;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: patient
      ? {
          mrn: patient.mrn,
          name: patient.name,
          dateOfBirth: patient.dateOfBirth ?? "",
          gender: patient.gender ?? "",
          phone: patient.phone ?? "",
          address: patient.address ?? "",
          allergies: patient.allergies ?? "",
          notes: patient.notes ?? "",
        }
      : {
          mrn: "",
          name: "",
          dateOfBirth: "",
          gender: "",
          phone: "",
          address: "",
          allergies: "",
          notes: "",
        },
  });

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
      if (isEditing && patient) {
        await updatePatient(patient.id, payload);
      } else {
        await createPatient(payload);
      }
      onClose();
    } catch {
      setSubmitError(
        isEditing
          ? "Failed to update patient. Please try again."
          : "Failed to create patient. Please try again.",
      );
    }
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
