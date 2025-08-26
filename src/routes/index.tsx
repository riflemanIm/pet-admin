import { createHashRouter, RouterProvider } from 'react-router-dom';

// project import
import MainRoutes from './MainRoutes';
import LoginRoutes from './LoginRoutes';

// ==============================|| ROUTING RENDER ||============================== //

const router = createHashRouter([MainRoutes, LoginRoutes], { basename: import.meta.env.VITE_APP_BASE_NAME });

export default function Routing() {
  return <RouterProvider router={router} />;
}
