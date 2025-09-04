// routes/MainRoutes.tsx
import { lazy } from 'react';
import Loadable from 'components/Loadable';
import Dashboard from 'layout/Dashboard';

const Color = Loadable(lazy(() => import('pages/component-overview/color')));
const Typography = Loadable(lazy(() => import('pages/component-overview/typography')));
const Shadow = Loadable(lazy(() => import('pages/component-overview/shadows')));
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/index')));
const User = Loadable(lazy(() => import('pages/user/index')));
const EditUser = Loadable(lazy(() => import('pages/user/EditUser')));
const AddUser = Loadable(lazy(() => import('pages/user/AddUser')));
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/sample-page')));

// универсальные словари (эти компоненты внутри читают useParams<{entity}>)
const DictList = Loadable(lazy(() => import('pages/dicts')));
const AddDict = Loadable(lazy(() => import('pages/dicts/AddDict')));
const EditDict = Loadable(lazy(() => import('pages/dicts/EditDict')));

// (опционально) если хочешь поддержать старые пути, подключим Navigate:
import { Navigate } from 'react-router-dom';

const MainRoutes = {
  path: '/',
  element: <Dashboard />,
  children: [
    { path: '/', element: <DashboardDefault /> },
    { path: 'color', element: <Color /> },

    // Users
    { path: 'User', element: <User /> },
    { path: 'User/list', element: <User /> },
    { path: 'User/add', element: <AddUser /> },
    { path: 'User/:id/edit', element: <EditUser /> },

    // ===== УНИВЕРСАЛЬНЫЕ СЛОВАРИ (один набор роутов на все сущности) =====
    { path: 'dicts/:entity/list', element: <DictList /> },
    { path: 'dicts/:entity/add', element: <AddDict /> },
    { path: 'dicts/:entity/edit/:id', element: <EditDict /> },

    // ===== (необязательно) алиасы для старых ссылок, чтобы ничего не ломать =====
    // Можно удалить, когда переведёшь меню/ссылки на новые пути /dicts/:entity/...
    { path: 'ages/list', element: <Navigate to="/dicts/ages/list" replace /> },
    { path: 'ages/add', element: <Navigate to="/dicts/ages/add" replace /> },
    { path: 'ages/edit/:id', element: <Navigate to="/dicts/ages/edit/:id" replace /> },

    { path: 'taste/list', element: <Navigate to="/dicts/taste/list" replace /> },
    { path: 'taste/add', element: <Navigate to="/dicts/taste/add" replace /> },
    { path: 'taste/edit/:id', element: <Navigate to="/dicts/taste/edit/:id" replace /> },

    { path: 'designedFor/list', element: <Navigate to="/dicts/designedFor/list" replace /> },
    { path: 'designedFor/add', element: <Navigate to="/dicts/designedFor/add" replace /> },
    { path: 'designedFor/edit/:id', element: <Navigate to="/dicts/designedFor/edit/:id" replace /> },

    { path: 'ingredient/list', element: <Navigate to="/dicts/ingredient/list" replace /> },
    { path: 'ingredient/add', element: <Navigate to="/dicts/ingredient/add" replace /> },
    { path: 'ingredient/edit/:id', element: <Navigate to="/dicts/ingredient/edit/:id" replace /> },

    { path: 'hardness/list', element: <Navigate to="/dicts/hardness/list" replace /> },
    { path: 'hardness/add', element: <Navigate to="/dicts/hardness/add" replace /> },
    { path: 'hardness/edit/:id', element: <Navigate to="/dicts/hardness/edit/:id" replace /> },

    { path: 'packages/list', element: <Navigate to="/dicts/packages/list" replace /> },
    { path: 'packages/add', element: <Navigate to="/dicts/packages/add" replace /> },
    { path: 'packages/edit/:id', element: <Navigate to="/dicts/packages/edit/:id" replace /> },

    { path: 'petSizes/list', element: <Navigate to="/dicts/petSizes/list" replace /> },
    { path: 'petSizes/add', element: <Navigate to="/dicts/petSizes/add" replace /> },
    { path: 'petSizes/edit/:id', element: <Navigate to="/dicts/petSizes/edit/:id" replace /> },

    { path: 'specialNeeds/list', element: <Navigate to="/dicts/specialNeeds/list" replace /> },
    { path: 'specialNeeds/add', element: <Navigate to="/dicts/specialNeeds/add" replace /> },
    { path: 'specialNeeds/edit/:id', element: <Navigate to="/dicts/specialNeeds/edit/:id" replace /> },

    // misc
    { path: 'dashboard', children: [{ path: 'default', element: <DashboardDefault /> }] },
    { path: 'sample-page', element: <SamplePage /> },
    { path: 'shadow', element: <Shadow /> },
    { path: 'typography', element: <Typography /> }
  ]
};

export default MainRoutes;
