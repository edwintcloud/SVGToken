// imports
import { IndexPage, NotFoundPage } from './pages';

// routes
export default [
  {
    path: '/',
    component: IndexPage,
    key: 'index',
  },
  {
    path: '/not-found',
    component: NotFoundPage,
    key: 'not-found',
  },
];
