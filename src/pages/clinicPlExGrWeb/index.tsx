import React from "react";
import { ClinicPlExGrWebProvider } from "../../context/ClinicPlExGrWebContext";
import ClinicPlExGrWebList from "./ClinicPlExGrWebList";

export default function ClinicPlExGrWeb(): JSX.Element {
  return (
    <ClinicPlExGrWebProvider>
      <ClinicPlExGrWebList />
    </ClinicPlExGrWebProvider>
  );
}
