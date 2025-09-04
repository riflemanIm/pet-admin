// src/pages/dicts/DictListPage.tsx
import { useParams } from 'react-router-dom';
import { DictProvider, EntityName } from '../../context/DictContext';
import DictList from './DictList';

export default function DictListPage(): JSX.Element {
  const { entity } = useParams<{ entity: EntityName }>();
  if (!entity) throw new Error('Missing :entity in route');

  return (
    <DictProvider entity={entity}>
      <DictList entity={entity} />
    </DictProvider>
  );
}
