import React from 'react';
import SpecializationList from './SpecializationList';
import { SpecializationProvider } from '../../context/SpecializationContext';

const Specializations: React.FC = () => {
  return (
    <SpecializationProvider>
      <SpecializationList />
    </SpecializationProvider>
  );
};
export default Specializations;
