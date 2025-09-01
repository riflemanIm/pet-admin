import React from 'react';
import UserList from './UserList';
import { ManagementProvider } from 'context/ManagementContext';

export default function Users(): JSX.Element {
  return (
    <ManagementProvider>
      <UserList />
    </ManagementProvider>
  );
}
