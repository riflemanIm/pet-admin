import React from "react";
import ClinicList from "./ClinicList";
import { ClinicProvider } from "../../context/ClinicContext";

export default function Clinics(): JSX.Element {
  return (
    <ClinicProvider>
      <ClinicList />
    </ClinicProvider>
  );
}
