// project import
import { AppLanguageProvider } from './context/LanguageContext';
import ThemeCustomization from './themes';
import ScrollTop from './components/ScrollTop';
import { UserProvider } from './context/UserContext';
import Routing from './routes';

// ==============================|| APP - THEME, ROUTER, LOCAL ||============================== //

export default function App() {
  return (
    <AppLanguageProvider>
      <ThemeCustomization>
        <UserProvider>
          <ScrollTop>
            <Routing />
          </ScrollTop>
        </UserProvider>
      </ThemeCustomization>
    </AppLanguageProvider>
  );
}
