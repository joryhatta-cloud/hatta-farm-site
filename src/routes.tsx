import { RouteObject } from 'react-router';
import { lazy } from 'react';
import HomePage from './pages/index';
const ServicesPage = lazy(() => import('./pages/services'));
const HattaGuidePage = lazy(() => import('./pages/hatta-guide'));
const CategoryPage = lazy(() => import('./pages/category'));
const AdminLoginPage = lazy(() => import('./pages/admin/login'));
const AdminSetupPage = lazy(() => import('./pages/admin/setup'));
const AdminDashboardPage = lazy(() => import('./pages/admin/index'));
const AdminPropertiesPage = lazy(() => import('./pages/admin/properties'));
const AdminAnalyticsPage = lazy(() => import('./pages/admin/analytics'));
const ContactPage = lazy(() => import('./pages/contact'));
const PropertyDetailPage = lazy(() => import('./pages/property-detail'));
// Eager import so renderToString doesn't hit a Suspense boundary on 404 routes
// and abort to client rendering. The prod 404 page is tiny; the dev-tools
// variant stays lazy because it pulls in dev-only code we don't want in
// production bundles.
import ProdNotFoundPage from './pages/_404';

const NotFoundPage = ProdNotFoundPage;

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/contact',
    element: <ContactPage />,
  },
  {
    path: '/hatta-guide',
    element: <HattaGuidePage />,
  },
  {
    path: '/services',
    element: <ServicesPage />,
  },
  { path: '/admin/login', element: <AdminLoginPage /> },
  { path: '/admin/setup', element: <AdminSetupPage /> },
  { path: '/admin', element: <AdminDashboardPage /> },
  { path: '/admin/properties', element: <AdminPropertiesPage /> },
  { path: '/admin/analytics', element: <AdminAnalyticsPage /> },
  { path: '/resorts', element: <CategoryPage /> },
  { path: '/chalets', element: <CategoryPage /> },
  { path: '/farm-stays', element: <CategoryPage /> },
  { path: '/holiday-homes', element: <CategoryPage /> },
  { path: '/rooms', element: <CategoryPage /> },
  { path: '/event-friendly-stays', element: <CategoryPage /> },
  { path: '/property/:slug', element: <PropertyDetailPage /> },
  {
    id: 'airo-not-found',
    path: '*',
    element: <NotFoundPage />,
  },
];

// Types for type-safe navigation
export type Path = '/';

export type Params = Record<string, string | undefined>;
