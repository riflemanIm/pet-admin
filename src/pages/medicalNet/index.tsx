import React from "react";
import MedicalNetList from "./MedicalNetList";
import { MedicalNetProvider } from "../../context/MedicalNetContext";

export default function MedicalNets(): JSX.Element {
  return (
    <MedicalNetProvider>
      <MedicalNetList />
    </MedicalNetProvider>
  );
}
