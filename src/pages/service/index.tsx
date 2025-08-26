import React from "react";
import ServiceList from "./ServiceList";
import { ServiceProvider } from "../../context/ServiceContext";

export default function Services(): JSX.Element {
  return (
    <ServiceProvider>
      <ServiceList />
    </ServiceProvider>
  );
}
