import AuthLayout from '@/layouts/AuthLayout';
import BaseLayout from '@/layouts/BaseLayout';

import { ROUTER } from '@/configs/router';
import ProtectedLayout from '@/layouts/ProtectedLayout';
import Page403 from '@/pages/Error/403';
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements
} from 'react-router-dom';
import Page404 from '../pages/Error/404';
import { Home } from '../pages/Home';
import Login from '../pages/Login';
import { Permission } from '../pages/Permission';
import { Profile } from '../pages/Profile';
import { User } from '../pages/User';
import { UserDetails } from '../pages/UserDetails';
import { Session } from '@/pages/Session';
import Unit from '@/pages/Unit';

const router = () => {
  return createBrowserRouter(
    createRoutesFromElements(
      <Route element={<BaseLayout />}>
        <Route element={<AuthLayout />}>
          <Route path={ROUTER.LOGIN} element={<Login />} />
        </Route>
        <Route path={ROUTER.BASE} element={<ProtectedLayout />}>
          <Route path={ROUTER.BASE} element={<Home />} />
          <Route path={ROUTER.PROFILE} element={<Profile />} />
          <Route path={ROUTER.UNIT} element={<Unit />} />
          <Route path={ROUTER.USER} element={<User />} />
          <Route path={ROUTER.USER_DETAILS} element={<UserDetails />} />
          {/* <Route path={ROUTER.PERMISSION} element={<Permission />} /> */}
          <Route path={ROUTER.SESSION} element={<Session />} />
          <Route path={ROUTER.UNAUTHORIZE} element={<Page403 />} />
          <Route path="*" element={<Page404 />} />
        </Route>
      </Route>
    )
  );
};

export default router;
