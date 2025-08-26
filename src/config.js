// ==============================|| THEME CONFIG  ||============================== //
const pNames = ['mobimed_site', 'mobi_app', 'telemedialog', 'messaging_service', 'chat', 'admin', 'test'];

const config = {
  pNames,
  baseURLApi: import.meta.env.VITE_API_URL || '/api',
  defLang: 'ru',
  auth: {
    email: import.meta.env.VITE_LOGIN || '',
    password: import.meta.env.VITE_PASS || ''
  },
  defaultPath: '/dashboard/default',
  fontFamily: `'Public Sans', sans-serif`,
  i18n: 'en',
  miniDrawer: false,
  container: true,
  mode: 'light',
  presetColor: 'default',
  themeDirection: 'ltr'
};

export default config;
export const drawerWidth = 260;

export const twitterColor = '#1DA1F2';
export const facebookColor = '#3b5998';
export const linkedInColor = '#0e76a8';
