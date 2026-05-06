"use client";

import { useRouter } from "next/navigation";
import { Spinner, Accordion, Button } from "@heroui/react";
import { ChevronDown, Person, Smartphone, FileText, Heart, Calendar } from "@gravity-ui/icons";
import { usePatient } from "@/hooks/use-patients";
import { InfoField } from "@/components/ui";
import { formatDate, cn } from "@/utils";
import { ROUTES } from "@/constants";

function formatGender(gender?: string | null): string {
  if (!gender) return "-";
  return gender.charAt(0) + gender.slice(1).toLowerCase();
}

function ActiveBadge({ active }: { active: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        active
          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      )}
    >
      {active ? "Active" : "Inactive"}
    </span>
  );
}

interface PatientDetailProps {
  id: string;
}

export function PatientDetail({ id }: PatientDetailProps) {
  const { patient, isLoading, error } = usePatient(id);
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-12">
        <Spinner size="lg" />
        <p className="text-sm text-zinc-500">Loading patient detail...</p>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12">
        <p className="text-sm text-danger">
          {error ? "Failed to load patient details." : "Patient not found."}
        </p>
        <Button variant="secondary" size="sm" onPress={() => router.push(ROUTES.patients)}>
          Back to Patients
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">{patient.name}</h1>
          <p className="text-sm text-default-400">MRN: {patient.mrn}</p>
        </div>
        <ActiveBadge active={patient.active} />
      </div>

      <Accordion
        allowsMultipleExpanded
        defaultExpandedKeys={["personal-info", "contact-info", "medical-info", "additional-info"]}
        variant="default"
      >
        <Accordion.Item id="personal-info">
          <Accordion.Heading>
            <Accordion.Trigger>
              <span className="mr-3 size-4 shrink-0 text-muted">
                <Person />
              </span>
              Personal Information
              <Accordion.Indicator>
                <ChevronDown />
              </Accordion.Indicator>
            </Accordion.Trigger>
          </Accordion.Heading>
          <Accordion.Panel>
            <Accordion.Body>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <InfoField label="MRN" value={patient.mrn} />
                <InfoField label="Full Name" value={patient.name} />
                <InfoField label="Gender" value={formatGender(patient.gender)} />
                <InfoField label="Date of Birth" value={patient.dateOfBirth ? formatDate(patient.dateOfBirth) : "-"} />
              </div>
            </Accordion.Body>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item id="contact-info">
          <Accordion.Heading>
            <Accordion.Trigger>
              <span className="mr-3 size-4 shrink-0 text-muted">
                <Smartphone />
              </span>
              Contact Information
              <Accordion.Indicator>
                <ChevronDown />
              </Accordion.Indicator>
            </Accordion.Trigger>
          </Accordion.Heading>
          <Accordion.Panel>
            <Accordion.Body>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InfoField label="Phone" value={patient.phone ?? "-"} />
                <InfoField label="Address" value={patient.address ?? "-"} />
              </div>
            </Accordion.Body>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item id="medical-info">
          <Accordion.Heading>
            <Accordion.Trigger>
              <span className="mr-3 size-4 shrink-0 text-muted">
                <Heart />
              </span>
              Medical Information
              <Accordion.Indicator>
                <ChevronDown />
              </Accordion.Indicator>
            </Accordion.Trigger>
          </Accordion.Heading>
          <Accordion.Panel>
            <Accordion.Body>
              <div className="flex flex-col gap-2">
                <InfoField label="Allergies" value={patient.allergies ?? "-"} />
              </div>
            </Accordion.Body>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item id="additional-info">
          <Accordion.Heading>
            <Accordion.Trigger>
              <span className="mr-3 size-4 shrink-0 text-muted">
                <FileText />
              </span>
              Notes
              <Accordion.Indicator>
                <ChevronDown />
              </Accordion.Indicator>
            </Accordion.Trigger>
          </Accordion.Heading>
          <Accordion.Panel>
            <Accordion.Body>
              <div className="flex flex-col gap-2">
                <InfoField label="Notes" value={patient.notes ?? "-"} />
              </div>
            </Accordion.Body>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item id="record-info">
          <Accordion.Heading>
            <Accordion.Trigger>
              <span className="mr-3 size-4 shrink-0 text-muted">
                <Calendar />
              </span>
              Record Information
              <Accordion.Indicator>
                <ChevronDown />
              </Accordion.Indicator>
            </Accordion.Trigger>
          </Accordion.Heading>
          <Accordion.Panel>
            <Accordion.Body>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InfoField label="Created At" value={formatDate(patient.createdAt)} />
                <InfoField label="Updated At" value={formatDate(patient.updatedAt)} />
              </div>
            </Accordion.Body>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>

      <div className="flex justify-end">
        <Button variant="secondary" onPress={() => router.push(ROUTES.patients)}>
          Back to Patients
        </Button>
      </div>
    </div>
  );
}
