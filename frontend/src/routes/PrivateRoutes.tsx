import React, { JSX } from 'react';
import useAuth from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import RouteConstants from './routeConstants';
import Signin from '../pages/Signin';

const PrivateRoutes = ({children}: {children: JSX.Element}) => {
  return children
}

export default PrivateRoutes;