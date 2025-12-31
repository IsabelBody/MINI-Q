import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface AuthContextType {
  isAuthenticated: boolean;
  clinicianName: string | null;
  isAdmin: boolean; 
  login: (name: string, adminStatus: boolean, token: string) => void;
  clinicianEmail: string | null;
  logout: () => void;
  updateSessionEmail: (email: string) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [clinicianName, setClinicianName] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false); 
  const [clinicianEmail, setClinicianEmail] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedName = localStorage.getItem('clinicianName');
    const storedIsAdmin = localStorage.getItem('isAdmin') === 'true';
    const storedEmail = localStorage.getItem('clinicianEmail');
  
    if (token && storedName && storedEmail !== null) {
      setIsAuthenticated(true); 
      setClinicianName(storedName);
      setIsAdmin(storedIsAdmin);
      setClinicianEmail(storedEmail);
  
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      setIsAuthenticated(false);
    }
  }, []);
  
  

  const login = (name: string, adminStatus: boolean, token: string) => {
    setIsAuthenticated(true);
    setClinicianName(name);
    setIsAdmin(adminStatus);
    
    localStorage.setItem('token', token);  
    localStorage.setItem('clinicianName', name);
    localStorage.setItem('isAdmin', String(adminStatus));
    localStorage.setItem('clinicianEmail', ''); 
    
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('clinicianName');
    localStorage.removeItem('isAdmin'); 
    localStorage.removeItem('clinicianEmail');

    /* Removing portal table states */
    localStorage.removeItem("tableSorting");
    localStorage.removeItem("tableFilters");
    localStorage.removeItem("globalFilter");
    localStorage.removeItem("showActioned");
    localStorage.removeItem("selectedDate");
    localStorage.removeItem("pageIndex");
    localStorage.removeItem("pageSize"); 


    
    setIsAuthenticated(false);
    setClinicianName(null);
    setIsAdmin(false);
    setClinicianEmail(null);

    delete axios.defaults.headers.common['Authorization'];
  };

  const updateSessionEmail = (email : string) => {
    setClinicianEmail(email);
    localStorage.setItem('clinicianEmail', email);
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, clinicianName, isAdmin, clinicianEmail, login, logout, updateSessionEmail }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
