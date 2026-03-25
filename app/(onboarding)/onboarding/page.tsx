"use client";

import { useState } from "react";
import OrganizationForm from "./_components/organization-form";
import BranchForm from "./_components/branch-form";

export default function OnboardingPage() {
  const [step, setStep] = useState<"organization" | "branch">("organization");
  const [organizationId, setOrganizationId] = useState<string | null>(null);

  return (
    <>
      {step === "organization" && (
        <OrganizationForm
          onSuccess={(organizationId) => {
            setOrganizationId(organizationId);
            setStep("branch");
          }}
        />
      )}

      {step === "branch" && organizationId && (
        <BranchForm
          organizationId={organizationId}
          onBack={() => setStep("organization")}
        />
      )}
    </>
  );
}
