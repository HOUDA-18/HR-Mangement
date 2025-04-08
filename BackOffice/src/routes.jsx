import React, { Suspense, Fragment, lazy } from 'react';
import { Routes, Navigate, Route } from 'react-router-dom';

// project import
import Loader from './components/Loader/Loader';
import AdminLayout from './layouts/AdminLayout';
import AuthGuard from './config/AuthGuard';
import { BASE_URL } from './config/constant';

// ==============================|| ROUTES ||============================== //

const renderRoutes = (routes = []) => (
  <Suspense fallback={<Loader />}>
    <Routes>
      {routes.map((route, i) => {
        const Guard = route.guard || Fragment;
        const Layout = route.layout || Fragment;
        const Element = route.element;

        return (
          <Route
            key={i}
            path={route.path}
            exact={route.exact}
            element={
              <Guard>
                <Layout>{route.routes ? renderRoutes(route.routes) : <Element props={true} />}</Layout>
              </Guard>
            }
          />
        );
      })}
    </Routes>
  </Suspense>
);

export const routes = [
  {
    exact: 'true',
    path: '/auth/signup-1',
    element: lazy(() => import('./views/auth/signup/SignUp1'))
  },

  {
    exact: 'true',
    path: '/auth/signin-1',
    element: lazy(() => import('./views/auth/signin/SignIn1'))
  },
  {
    exact: 'true',
    path: '/auth/reset-password-1',
    element: lazy(() => import('./views/auth/reset-password/ResetPassword1'))
  },
  {
    exact: 'true',
    path: '/auth/reset-password/:token',
    element: lazy(() => import('./views/auth/reset-password-1/passwordReset'))
  },
  {
    exact: true,
    path: '/auth/face-login',
    element: lazy(() => import('./views/auth/face/Loginface')),
    guard: (props) => <AuthGuard allowedRoles={['public']}>{props.children}</AuthGuard>
  },
  {
    exact: true,
    path: '/auth/face-signup',
    element: lazy(() => import('./views/auth/face/Signupface')),
    guard: (props) => <AuthGuard allowedRoles={['public']}>{props.children}</AuthGuard>
  },

  {
    exact: 'true',
    path: '/auth/2fa/',
    element: lazy(() => import('./views/auth/2fa/TwoFASetup'))
  },
  
  
  {
    path: '*',
    layout: AdminLayout,
    routes: [
      {
        exact: 'true',
        path: '/app/dashboard/analytics',
        element: lazy(() => import('./views/dashboard')),
        guard: (props) => <AuthGuard allowedRoles={['SUPER_ADMIN', 'EMPLOYEE','HEAD_DEPARTEMENT','MEMBRE_HR','ADMIN_HR']}>{props.children}</AuthGuard>
      },
      {
        exact: 'true',
        path: '/app/dashboard/departements',
        element: lazy(() => import('./views/departements')),
        guard: (props) => <AuthGuard allowedRoles={['SUPER_ADMIN','MEMBRE_HR','ADMIN_HR','HEAD_DEPARTEMENT','dev']}>{props.children}</AuthGuard>
      },
      {
        exact: 'true',
        path: '/app/dashboard/departements/details',
        element: lazy(() => import('./views/departements/viewDepartement')),
        guard: (props) => <AuthGuard allowedRoles={['SUPER_ADMIN', 'EMPLOYEE','HEAD_DEPARTEMENT','dev']}>{props.children}</AuthGuard>
      },
      {
        exact: 'true',
        path: '/app/dashboard/departements/details/team/details',
        element: lazy(() => import('./views/departements/viewTeam/index')),
        guard: (props) => <AuthGuard allowedRoles={['SUPER_ADMIN', 'EMPLOYEE','HEAD_DEPARTEMENT','dev']}>{props.children}</AuthGuard>
      },
      {
        exact: 'true',
        path: '/app/dashboard/offers',
        element: lazy(() => import('./views/offer')),
        guard: (props) => <AuthGuard allowedRoles={['SUPER_ADMIN', 'EMPLOYEE','HEAD_DEPARTEMENT','HEAD_DEPARTEMENT','MEMBRE_HR','ADMIN_HR']}>{props.children}</AuthGuard>
      },
      {
        exact: 'true',
        path: '/app/dashboard/leaves',
        element: lazy(() => import('./views/leaves')),
        guard: (props) => <AuthGuard allowedRoles={['SUPER_ADMIN', 'EMPLOYEE','HEAD_DEPARTEMENT','HEAD_DEPARTEMENT','MEMBRE_HR','ADMIN_HR']}>{props.children}</AuthGuard>
      },
      {
        exact: 'true',
        path: '/app/dashboard/workshops',
        element: lazy(() => import('./views/workshops')),
        guard: (props) => <AuthGuard allowedRoles={['SUPER_ADMIN', 'EMPLOYEE','HEAD_DEPARTEMENT','HEAD_DEPARTEMENT']}>{props.children}</AuthGuard>
      },
      {
        exact: 'true',
        path: '/app/dashboard/employees',
        element: lazy(() => import('./views/employees')),
        guard: (props) => <AuthGuard allowedRoles={['SUPER_ADMIN','HEAD_DEPARTEMENT','ADMIN_HR','MEMBRE_HR']}>{props.children}</AuthGuard>
      },
      {
        exact: 'true',
        path: '/app/dashboard/employees/add',
        element: lazy(() => import('./views/form'))
      },
      {
        exact: 'true',
        path: '/app/dashboard/employees/employeeDetails',
        element: lazy(() => import('./views/employees/employeeDetails/index'))
      },
      {
        exact: 'true',
        path: '/app/dashboard/events',
        element: lazy(() => import('./views/events')),
        guard: (props) => <AuthGuard allowedRoles={['SUPER_ADMIN', 'EMPLOYEE','HEAD_DEPARTEMENT','HEAD_DEPARTEMENT','ADMIN_HR']}>{props.children}</AuthGuard>
      },
      {
        exact: 'true',
        path: '/app/dashboard/attendance',
        element: lazy(() => import('./views/attendance')),
        guard: (props) => <AuthGuard allowedRoles={['SUPER_ADMIN', 'HEAD_DEPARTEMENT','HEAD_DEPARTEMENT','EMPLOYEE']}>{props.children}</AuthGuard>
      },
      {
        exact: 'true',
        path: '/app/dashboard/complaints',
        element: lazy(() => import('./views/complaint')),
        guard: (props) => <AuthGuard allowedRoles={['SUPER_ADMIN', 'EMPLOYEE','HEAD_DEPARTEMENT','ADMIN_HR','HEAD_DEPARTEMENT']}>{props.children}</AuthGuard>
      },
      {
        exact: 'true',
        path: '/app/dashboard/chat-rooms',
        element: lazy(() => import('./views/chat-rooms')),
        guard: (props) => <AuthGuard allowedRoles={['SUPER_ADMIN', 'EMPLOYEE','HEAD_DEPARTEMENT','ADMIN_HR','EMPLOYEE','HEAD_DEPARTEMENT']}>{props.children}</AuthGuard>
      },
      {
        exact: 'true',
        path: '/app/dashboard/profile',
        element: lazy(() => import('./views/profile/profilePage'))
      },
      {
        exact: 'true',
        path: '/app/dashboard/updateProfile',
        element: lazy(() => import('./views/profile/updateProfile'))
      },
      {
        exact: 'true',
        path: '/app/dashboard/hr-member',
        element: lazy(() => import('./views/hr-member')),
        guard: (props) => <AuthGuard allowedRoles={['SUPER_ADMIN', 'EMPLOYEE','HEAD_DEPARTEMENT','ADMIN_HR','MEMBRE_HR']}>{props.children}</AuthGuard>
      }/* ,
      {
        exact: 'true',
        path: '/basic/button',
        element: lazy(() => import('./views/ui-elements/BasicButton'))
      },
      {
        exact: 'true',
        path: '/basic/badges',
        element: lazy(() => import('./views/ui-elements/BasicBadges'))
      },
      {
        exact: 'true',
        path: '/basic/breadcrumb-pagination',
        element: lazy(() => import('./views/ui-elements/BasicBreadcrumbPagination'))
      },
      {
        exact: 'true',
        path: '/basic/collapse',
        element: lazy(() => import('./views/ui-elements/BasicCollapse'))
      },

      {
        exact: 'true',
        path: '/basic/typography',
        element: lazy(() => import('./views/ui-elements/BasicTypography'))
      },
      {
        exact: 'true',
        path: '/basic/tooltip-popovers',
        element: lazy(() => import('./views/ui-elements/BasicTooltipsPopovers'))
      },
      {
        exact: 'true',
        path: '/sample-page',
        element: lazy(() => import('./views/extra/SamplePage'))
      } */,
       
  // Nouvelle route pour le login facial
  {
    exact: 'true',
    path: '/auth/face-login',
    element: lazy(() => import('./views/auth/face/Loginface')), // Adaptez le chemin
    guard: (props) => <AuthGuard allowedRoles={['public']}>{props.children}</AuthGuard>
  },

  // Nouvelle route pour l'inscription faciale
  {
    exact: 'true',
    path: '/auth/face-signup',
    element: lazy(() => import('./views/auth/face/Signupface')), // Adaptez le chemin
    guard: (props) => <AuthGuard allowedRoles={['public']}>{props.children}</AuthGuard>
  },
      {
        path: '*',
        exact: 'true',
        element: () => <Navigate to={BASE_URL} />
      }
    ]
  }
];

export default renderRoutes;