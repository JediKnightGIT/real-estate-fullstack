import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

import { useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';

const PrivateRoute: React.FC = () => {
  const { currentUser } = useAppSelector((state: RootState) => state.user);
  return currentUser ? <Outlet /> : <Navigate to="/sign-in" />;
};

export default PrivateRoute;
