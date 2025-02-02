import React from "react";
import styled from "styled-components";
import useAuth from "../hooks/useAuth";
import { Link } from "react-router-dom";
import RouteConstants from "../routes/routeConstants";

const Navbar = () => {
  const { isAuthenticated, isAdmin, loggedin_user_name } = useAuth();
  return (
    <Nav>
      <Logo>Event Management</Logo>
      <NavLinks>
        <StyledLink to="/">Home</StyledLink>
        {isAuthenticated && isAdmin && <StyledLink to={RouteConstants.location}>Locations</StyledLink>}
        {isAuthenticated && isAdmin && <StyledLink to={RouteConstants.events}>Events</StyledLink>}
        {isAuthenticated  && <StyledLink to={RouteConstants.myevents}>My Events</StyledLink>}
        {!isAuthenticated && <StyledLink to={RouteConstants.signin}>Signin</StyledLink>}
        {!isAuthenticated && <StyledLink to={RouteConstants.signup}>Signup</StyledLink>}
        {isAuthenticated && <StyledLink to="#">{loggedin_user_name}</StyledLink>}
        {isAuthenticated && (
          <StyledLink to={RouteConstants.signin} onClick={() => localStorage.clear()}>
            Logout
          </StyledLink>
        )}
      </NavLinks>
    </Nav>
  );
};

// Styled Components
const Nav = styled.nav`
  background: linear-gradient(135deg, #4a90e2, #0072ff);
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.div`
  font-size: 1.1rem;
  font-weight: bold;
  color: white;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 20px;
`;

// Styled Link
const StyledLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-size: 1.1rem;
  font-weight: 500;
  transition: all 0.3s ease-in-out;
  padding: 8px 16px;
  border-radius: 5px;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

export default Navbar;
