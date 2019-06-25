// imports
import { IndexPage, NotFoundPage, DashboardPage } from './pages';

// routes
export default [
  {
    path: '/',
    component: IndexPage,
    key: 'index',
  },
  {
    path: '/dashboard',
    component: DashboardPage,
    key: 'dashboard',
  },
  {
    path: '/not-found',
    component: NotFoundPage,
    key: 'not-found',
  },
];
