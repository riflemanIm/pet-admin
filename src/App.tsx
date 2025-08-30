// project import
import { AppLanguageProvider } from './context/LanguageContext';
import AppThemeProvider from './theme';
import ScrollTop from './components/ScrollTop';
import { UserProvider } from './context/UserContext';
import Routing from './routes';

// ==============================|| APP - THEME, ROUTER, LOCAL ||============================== //

export default function App() {
  return (
    <AppLanguageProvider>
      <AppThemeProvider>
        <UserProvider>
          <ScrollTop>
            <Routing />
          </ScrollTop>
        </UserProvider>
      </AppThemeProvider>
    </AppLanguageProvider>
  );
}
