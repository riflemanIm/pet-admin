// src/pages/dicts/DictListPage.tsx
import { useParams } from 'react-router-dom';
import { DictProvider, EntityName } from '../../context/DictContext';
import DictList from './DictList';

export default function DictListPage(): JSX.Element {
  const { entity } = useParams<{ entity: EntityName }>();
  const e = (entity ?? 'ages') as EntityName;

  return (
    <DictProvider entity={e}>
      <DictList entity={e} />
    </DictProvider>
  );
}
