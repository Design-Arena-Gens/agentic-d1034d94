import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from './App';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import MembersPage from './pages/MembersPage';
import AttendancePage from './pages/AttendancePage';
import PerformancePage from './pages/PerformancePage';
import { Protected } from './state/Protected';

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/dashboard" replace /> },
  { path: '/login', element: <LoginPage /> },
  {
    path: '/',
    element: (
      <Protected>
        <App />
      </Protected>
    ),
    children: [
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/members', element: <MembersPage /> },
      { path: '/attendance', element: <AttendancePage /> },
      { path: '/performance', element: <PerformancePage /> }
    ]
  }
]);
