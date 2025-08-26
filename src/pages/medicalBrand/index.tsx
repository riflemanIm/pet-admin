import React from "react";
import MedicalBrandList from "./MedicalBrandList";
import { MedicalBrandProvider } from "../../context/MedicalBrandContext";

export default function MedicalBrands(): JSX.Element {
  return (
    <MedicalBrandProvider>
      <MedicalBrandList />
    </MedicalBrandProvider>
  );
}
