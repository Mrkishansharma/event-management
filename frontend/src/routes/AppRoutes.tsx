import React from 'react'
import { Route, Routes } from 'react-router-dom';
import RouteConstants from './routeConstants';
import Dashboard from '../pages/Dashboard';
import Signup from '../pages/Signup';
import Signin from '../pages/Signin';
import PrivateRoutes from './PrivateRoutes';
import useAuth from '../hooks/useAuth';
import EventDetails from '../pages/EventDetailsPage';
import Locations from '../pages/locations';
import Events from '../pages/Events';
import MyEvents from '../pages/MyEvents';

const AppRoutes = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  console.log('isAuthenticated ', isAuthenticated)
  return (
    <Routes>
      <Route path={RouteConstants.home} element={<Dashboard />} />
      <Route path={RouteConstants.signin} element={<Signin />} />
      <Route path={RouteConstants.signup} element={<Signup />} />
      <Route path={RouteConstants.location} element={<Locations />} />
      <Route path={RouteConstants.events} element={<Events />} />
      <Route path={RouteConstants.myevents} element={<MyEvents />} />
      <Route path='/eventDetails/:id' element={
        <PrivateRoutes>
          <EventDetails />
        </PrivateRoutes>
      } />
    </Routes>
  )
}

export default AppRoutes;