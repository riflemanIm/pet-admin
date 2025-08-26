const pNames = ['mobimed_site', 'mobi_app', 'telemedialog', 'messaging_service', 'chat', 'admin', 'test'];

const config = {
  pNames,
  baseURLApi: import.meta.env.VITE_API_URL || '/api',
  defLang: 'ru',
  auth: {
    email: import.meta.env.VITE_LOGIN || '',
    password: import.meta.env.VITE_PASS || ''
  }
};

export default config;
