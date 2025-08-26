import { useEffect } from 'react';
import { Navigate, Outlet, Route } from 'react-router-dom';

// material-ui
import useMediaQuery from '@mui/material/useMediaQuery';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import { Theme } from '@mui/material/styles';

// project import
import Drawer from './Drawer';
import Header from './Header';
import navigation from 'menu-items';
import Loader from 'components/Loader';
import Breadcrumbs from 'components/@extended/Breadcrumbs';

import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';
import { useUserState } from 'context/UserContext';

// ==============================|| MAIN LAYOUT ||============================== //

export default function DashboardLayout() {
  const { menuMasterLoading } = useGetMenuMaster();
  const downXL = useMediaQuery((theme: Theme) => theme.breakpoints.down('xl'));

  useEffect(() => {
    handlerDrawerOpen(!downXL);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [downXL]);
  const { isAuthenticated } = useUserState();
  console.log('isAuthenticated', isAuthenticated);

  // const rootRoute = () => {
  //   if (!isAuthenticated) return '/login';
  //   const firstItem = structure.find((it) => (it.kind ?? 'page') === 'page' && it.role?.includes(currentUser.role));
  //   return firstItem?.link || '/login';
  // };

  if (menuMasterLoading) return <Loader />;
  if (!isAuthenticated) return <Navigate to="/login" />;

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <Header />
      <Drawer />
      <Box component="main" sx={{ width: 'calc(100% - 260px)', flexGrow: 1, p: { xs: 2, sm: 3 } }}>
        <Toolbar />
        <Breadcrumbs navigation={navigation} title />
        <Outlet />
      </Box>
    </Box>
  );
}
