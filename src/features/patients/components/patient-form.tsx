"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Button, Spinner, TextArea } from "@heroui/react";
import { patientSchema, type PatientFormValues, type Patient } from "@/features/patients/types";
import { usePatients } from "@/features/patients/hooks";
import { cn } from "@/utils";

interface PatientFormProps {
  patient?: Patient;
  onClose: () => void;
}

const genderOptions = [
  { value: "", label: "Select gender" },
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "OTHER", label: "Other" },
] as const;

export function PatientForm({ patient, onClose }: PatientFormProps) {
  const { createPatient, updatePatient, isCreating, isUpdating } = usePatients();
  const isEditing = !!patient;
  const isSubmitting = isCreating || isUpdating;

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
          dateOfBirth: patient.dateOfBirth?.split("T")[0] ?? "",
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
    const payload = {
      ...data,
      dateOfBirth: data.dateOfBirth || undefined,
      gender: data.gender || undefined,
      phone: data.phone || undefined,
      address: data.address || undefined,
      allergies: data.allergies || undefined,
      notes: data.notes || undefined,
    };

    if (isEditing && patient) {
      await updatePatient(patient.id, payload);
    } else {
      await createPatient(payload);
    }
    onClose();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="mrn" className="text-sm font-medium">
            MRN <span className="text-danger">*</span>
          </label>
          <Input
            id="mrn"
            placeholder="Enter medical record number"
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
            Date of Birth
          </label>
          <Input
            id="dateOfBirth"
            type="date"
            {...register("dateOfBirth")}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="gender" className="text-sm font-medium">
            Gender
          </label>
          <select
            id="gender"
            {...register("gender")}
            className={cn(
              "flex h-9 w-full rounded-lg border border-default-300 bg-transparent px-3 py-1 text-sm shadow-sm outline-none transition-colors",
              "focus:border-primary focus:ring-1 focus:ring-primary",
              "data-[hover=true]:border-default-400",
              "dark:border-default-200"
            )}
          >
            {genderOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="phone" className="text-sm font-medium">
          Phone
        </label>
        <Input
          id="phone"
          type="tel"
          placeholder="Enter phone number"
          {...register("phone")}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="address" className="text-sm font-medium">
          Address
        </label>
        <TextArea
          id="address"
          placeholder="Enter address"
          {...register("address")}
        />
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

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="ghost" onPress={onClose}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          isDisabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <Spinner size="sm" />
              {isEditing ? "Updating..." : "Creating..."}
            </span>
          ) : (
            isEditing ? "Update Patient" : "Create Patient"
          )}
        </Button>
      </div>
    </form>
  );
}
