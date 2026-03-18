import { Login } from './login/Login';
import { Box, Container, Stack } from '@mui/material';
import { AppHeader } from './landing-page/AppHeader';
import { createHashRouter, Outlet, RouterProvider } from 'react-router-dom';
import { AppMenu } from './landing-page/AppMenu';
import { menuColumns, MenuEntry } from './landing-page/menu-defs';
import { ErrorPage } from './login/ErrorPage';
import Loader from './common/Loader';
import { Connecting } from './login/Connecting';

const menuEntries: MenuEntry[] = menuColumns.reduce<MenuEntry[]>((acc, col) => [...acc, ...col.entries], []);

const router = () =>
  createHashRouter(
    [
      {
        path: '*',
        element: <AppNavigation />,
        errorElement: <ErrorPage />,
        children: [
          {
            path: '*',
            element: <AppMenu />
          },
          ...menuEntries.map(({ path, element }) => ({ path, element }))
        ]
      },

      {
        path: '/login',
        element: <Login />,
        errorElement: <ErrorPage />
      },
      {
        path: '/connecting',
        element: <Connecting />,
        errorElement: <ErrorPage />
      },

      {
        path: '/error-page',
        element: <ErrorPage />,
        errorElement: <ErrorPage />
      }
    ],
    {
      //basename
    }
  );

export function AppRouter() {
  return <RouterProvider router={router()} />;
}

function AppNavigation() {
  return (
    <Box
      sx={{
        display: 'block',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        boxSizing: 'border-box',
        p: 0
      }}
    >
      <AppHeader />

      <Container key={'app-menu'} maxWidth={false} sx={{ minHeight: '100vh' }}>
        <Stack spacing={2} mt={'1em'} mb={'1em'}>
          <Outlet />
        </Stack>
        <Loader />
      </Container>
    </Box>
  );
}
