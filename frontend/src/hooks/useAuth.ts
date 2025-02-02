import { useEffect, useState } from "react";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loggedin_user_name, setLoggedinUserName] = useState<string>('');

  useEffect(() => {
    (function getAuthData() {
      const token = localStorage.getItem('auth-token') || '';
      const role = localStorage.getItem('role') || '';
      const user_name = localStorage.getItem('user-name') || '';
      if (token) {
        setIsAuthenticated(true);
      }
      else {
        setIsAuthenticated(false);
      }
      if (role === 'admin') {
        setIsAdmin(true);
      }
      else {
        setIsAdmin(false);
      }
      setLoggedinUserName(user_name);
    })()
  }, [])

  return { isAuthenticated, isAdmin, loggedin_user_name };
}

export default useAuth;