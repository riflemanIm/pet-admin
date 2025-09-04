import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import Dashboard from 'layout/Dashboard';

const Color = Loadable(lazy(() => import('pages/component-overview/color')));
const Typography = Loadable(lazy(() => import('pages/component-overview/typography')));
const Shadow = Loadable(lazy(() => import('pages/component-overview/shadows')));
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/index')));
const User = Loadable(lazy(() => import('pages/user/index')));
const EditUser = Loadable(lazy(() => import('pages/user/EditUser')));
const AddUser = Loadable(lazy(() => import('pages/user/AddUser')));
// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/sample-page')));
const DictList = Loadable(lazy(() => import('pages/dicts')));
const AddDict = Loadable(lazy(() => import('pages/dicts/AddDict')));
const EditDict = Loadable(lazy(() => import('pages/dicts/EditDict')));
// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <Dashboard />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'color',
      element: <Color />
    },
    {
      path: 'User',
      element: <User />
    },
    {
      path: 'User/list',
      element: <User />
    },
    {
      path: 'User/add',
      element: <AddUser />
    },
    {
      path: 'User/:id/edit',
      element: <EditUser />
    },
    {
      path: 'ages/list',
      element: <DictList />
    },
    {
      path: 'ages/add',
      element: <AddDict />
    },
    {
      path: 'ages/edit/:id',
      element: <EditDict />
    },

    {
      path: 'taste/list',
      element: <DictList />
    },
    {
      path: 'taste/add',
      element: <AddDict />
    },
    {
      path: 'taste/edit/:id',
      element: <EditDict />
    },

    {
      path: 'designedFor/list',
      element: <DictList />
    },
    {
      path: 'designedFor/add',
      element: <AddDict />
    },
    {
      path: 'designedFor/edit/:id',
      element: <EditDict />
    },

    {
      path: 'ingredient/list',
      element: <DictList />
    },
    {
      path: 'ingredient/add',
      element: <AddDict />
    },
    {
      path: 'ingredient/edit/:id',
      element: <EditDict />
    },

    {
      path: 'hardness/list',
      element: <DictList />
    },
    {
      path: 'hardness/add',
      element: <AddDict />
    },
    {
      path: 'hardness/edit/:id',
      element: <EditDict />
    },

    {
      path: 'packages/list',
      element: <DictList />
    },
    {
      path: 'packages/add',
      element: <AddDict />
    },
    {
      path: 'packages/edit/:id',
      element: <EditDict />
    },

    {
      path: 'petSizes/list',
      element: <DictList />
    },
    {
      path: 'petSizes/add',
      element: <AddDict />
    },
    {
      path: 'petSizes/edit/:id',
      element: <EditDict />
    },

    {
      path: 'specialNeeds/list',
      element: <DictList />
    },
    {
      path: 'specialNeeds/add',
      element: <AddDict />
    },
    {
      path: 'specialNeeds/edit/:id',
      element: <EditDict />
    },

    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'sample-page',
      element: <SamplePage />
    },
    {
      path: 'shadow',
      element: <Shadow />
    },
    {
      path: 'typography',
      element: <Typography />
    }
  ]
};

export default MainRoutes;
