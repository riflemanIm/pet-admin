import React from "react";
import { ClinicSpecializationProvider } from "../../context/ClinicSpecializationContext";
import ClinicSpecializationList from "./ClinicSpecializationList";

export default function ClinicSpecializations(): JSX.Element {
  return (
    <ClinicSpecializationProvider>
      <ClinicSpecializationList />
    </ClinicSpecializationProvider>
  );
}
