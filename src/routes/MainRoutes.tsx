// routes/MainRoutes.tsx
import { lazy } from 'react';
import { Navigate, Outlet, useParams } from 'react-router-dom';
import Loadable from 'components/Loadable';
import Dashboard from 'layout/Dashboard';
import { FoodProvider } from 'context/FoodContext';
import { DictProvider, EntityName } from 'context/DictContext';
import { ManagementProvider } from 'context/ManagementContext';

const Color = Loadable(lazy(() => import('pages/component-overview/color')));
const Typography = Loadable(lazy(() => import('pages/component-overview/typography')));
const Shadow = Loadable(lazy(() => import('pages/component-overview/shadows')));
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/index')));
const UserList = Loadable(lazy(() => import('pages/user/index')));
const EditUser = Loadable(lazy(() => import('pages/user/EditUser')));
const AddUser = Loadable(lazy(() => import('pages/user/AddUser')));
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/sample-page')));

// универсальные словари (эти компоненты внутри читают useParams<{entity}>)
const DictList = Loadable(lazy(() => import('pages/dicts')));
const AddDict = Loadable(lazy(() => import('pages/dicts/AddDict')));
const EditDict = Loadable(lazy(() => import('pages/dicts/EditDict')));

const FoodList = Loadable(lazy(() => import('pages/food/FoodList')));
const AddFood = Loadable(lazy(() => import('pages/food/AddFood')));
const EditFood = Loadable(lazy(() => import('pages/food/EditFood')));

function FoodLayout() {
  return (
    <FoodProvider>
      <Outlet />
    </FoodProvider>
  );
}

function UserLayout() {
  return (
    <ManagementProvider>
      <Outlet />
    </ManagementProvider>
  );
}

function DictLayout() {
  const { entity } = useParams<{ entity: EntityName }>();
  if (!entity) {
    return <Navigate to="/dicts/ages" replace />;
  }
  return (
    <DictProvider entity={entity}>
      <Outlet />
    </DictProvider>
  );
}

function DictLegacyListRedirect() {
  const { entity } = useParams<{ entity: EntityName }>();
  if (!entity) {
    return <Navigate to="/dicts/ages" replace />;
  }
  return <Navigate to={`/dicts/${entity}`} replace />;
}

const MainRoutes = {
  path: '/',
  element: <Dashboard />,
  children: [
    { path: '/', element: <DashboardDefault /> },
    {
      path: 'food',
      element: <FoodLayout />, // <- провайдер здесь
      children: [
        { path: '', element: <FoodList /> },
        { path: 'list', element: <FoodList /> },
        { path: 'add', element: <AddFood /> },
        { path: ':id/edit', element: <EditFood /> }
      ]
    },
    //{ path: 'color', element: <Color /> },

    // Users
    {
      path: 'user',
      element: <UserLayout />,
      children: [
        { path: '', element: <UserList /> },
        { path: 'list', element: <UserList /> },
        { path: 'add', element: <AddUser /> },
        { path: ':id/edit', element: <EditUser /> }
      ]
    },

    // ===== УНИВЕРСАЛЬНЫЕ СЛОВАРИ (один набор роутов на все сущности) =====
    {
      path: 'dicts',
      children: [
        { path: '', element: <Navigate to="ages" replace /> },
        { path: ':entity/list', element: <DictLegacyListRedirect /> },
        { path: ':entity/edit', element: <DictLegacyListRedirect /> },
        {
          path: ':entity',
          element: <DictLayout />,
          children: [
            { path: '', element: <DictList /> },
            { path: 'add', element: <AddDict /> },
            { path: 'edit/:id', element: <EditDict /> }
          ]
        }
      ]
    },

    // ===== (необязательно) алиасы для старых ссылок, чтобы ничего не ломать =====
    // Можно удалить, когда переведёшь меню/ссылки на новые пути /dicts/:entity/...
    { path: 'ages/list', element: <Navigate to="/dicts/ages" replace /> },
    { path: 'ages/add', element: <Navigate to="/dicts/ages/add" replace /> },
    { path: 'ages/edit/:id', element: <Navigate to="/dicts/ages/edit/:id" replace /> },

    { path: 'taste/list', element: <Navigate to="/dicts/taste" replace /> },
    { path: 'taste/add', element: <Navigate to="/dicts/taste/add" replace /> },
    { path: 'taste/edit/:id', element: <Navigate to="/dicts/taste/edit/:id" replace /> },

    { path: 'designedFor/list', element: <Navigate to="/dicts/designedFor" replace /> },
    { path: 'designedFor/add', element: <Navigate to="/dicts/designedFor/add" replace /> },
    { path: 'designedFor/edit/:id', element: <Navigate to="/dicts/designedFor/edit/:id" replace /> },

    { path: 'ingredient/list', element: <Navigate to="/dicts/ingredient" replace /> },
    { path: 'ingredient/add', element: <Navigate to="/dicts/ingredient/add" replace /> },
    { path: 'ingredient/edit/:id', element: <Navigate to="/dicts/ingredient/edit/:id" replace /> },

    { path: 'hardness/list', element: <Navigate to="/dicts/hardness" replace /> },
    { path: 'hardness/add', element: <Navigate to="/dicts/hardness/add" replace /> },
    { path: 'hardness/edit/:id', element: <Navigate to="/dicts/hardness/edit/:id" replace /> },

    { path: 'packages/list', element: <Navigate to="/dicts/packages" replace /> },
    { path: 'packages/add', element: <Navigate to="/dicts/packages/add" replace /> },
    { path: 'packages/edit/:id', element: <Navigate to="/dicts/packages/edit/:id" replace /> },

    { path: 'petSizes/list', element: <Navigate to="/dicts/petSizes" replace /> },
    { path: 'petSizes/add', element: <Navigate to="/dicts/petSizes/add" replace /> },
    { path: 'petSizes/edit/:id', element: <Navigate to="/dicts/petSizes/edit/:id" replace /> },

    { path: 'specialNeeds/list', element: <Navigate to="/dicts/specialNeeds" replace /> },
    { path: 'specialNeeds/add', element: <Navigate to="/dicts/specialNeeds/add" replace /> },
    { path: 'specialNeeds/edit/:id', element: <Navigate to="/dicts/specialNeeds/edit/:id" replace /> },

    { path: 'typeTreat/list', element: <Navigate to="/dicts/typeTreat" replace /> },
    { path: 'typeTreat/add', element: <Navigate to="/dicts/typeTreat/add" replace /> },
    { path: 'typeTreat/edit/:id', element: <Navigate to="/dicts/typeTreat/edit/:id" replace /> }

    // misc
    //{ path: 'dashboard', children: [{ path: 'default', element: <DashboardDefault /> }] }
    // { path: 'sample-page', element: <SamplePage /> },
    // { path: 'shadow', element: <Shadow /> },
    // { path: 'typography', element: <Typography /> }
  ]
};

export default MainRoutes;
