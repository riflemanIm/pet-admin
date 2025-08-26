import React from 'react';

import { Link, Box, Breadcrumbs, Typography } from '@mui/material';
import { NavigateNext as NavigateNextIcon, SvgIconComponent } from '@mui/icons-material';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// styles

//Sidebar structure
import structure from '../Sidebar/SidebarStructure';

interface IRoute {
  name: string;
  url: string;
  icon?: SvgIconComponent;
}

const BreadCrumbs = (): JSX.Element => {
  const location = useLocation();

  const { t } = useTranslation();

  const convertGenericRoute = (route: string[]): IRoute[] => {
    const result = [] as IRoute[];
    let index = route.length - 1;
    while (index >= 0) {
      const url = '/' + route.slice(0, index + 1).join('/');
      const name = route[index];
      const knownItem = structure.find((it) => it.link && (it.link === url || (it.link.endsWith('/list') && it.link.slice(0, -5) === url)));
      if (knownItem) {
        result.unshift({
          name: t(`SIDEBAR.${knownItem.id}`),
          url,
          icon: knownItem.icon
        });
        break;
      }
      if (['edit', 'records', 'specialization', 'plExGrWeb', 'check', 'settings'].includes(name) && index > 0) {
        result.unshift({
          name: `${t('COMMON.' + name.toUpperCase())} ${route[index - 1]}`,
          url
        });
        index -= 2;
        continue;
      }
      if (name === 'add') {
        result.unshift({
          name: t('COMMON.ADD'),
          url
        });
        index--;
        continue;
      }
      result.unshift({
        name,
        url
      });
      index--;
    }
    return result;
  };

  const renderBreadCrumbs = () => {
    const route = location.pathname
      .split('/')
      .slice(1)
      .map((route) => route.split('-').join(' '));
    const routes = convertGenericRoute(route);
    const length = routes.length;
    return routes.map((item: IRoute, index: number) => {
      return (
        <Breadcrumbs key={index + '_b'} separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
          {length === index + 1 ? (
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }} color={length === index + 1 ? 'primary' : undefined}>
              {item.icon && <item.icon fontSize="inherit" sx={{ mr: 0.5 }} />}
              {item.name}
            </Typography>
          ) : (
            <Link
              variant="h6"
              href={`/#${item.url}`}
              sx={{ display: 'flex', alignItems: 'center' }}
              style={{ color: 'unset', textDecoration: 'none' }}
            >
              {item.icon && <item.icon fontSize="inherit" sx={{ mr: 0.5 }} />}
              {item.name}
            </Link>
          )}
        </Breadcrumbs>
      );
    });
  };

  return (
    <Box justifyContent="space-between" alignItems="center" style={{ overflowX: 'auto' }}>
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
        {renderBreadCrumbs()}
      </Breadcrumbs>
    </Box>
  );
};
export default BreadCrumbs;
