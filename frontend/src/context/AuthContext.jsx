import { createContext, useState, useEffect } from "react";
import { registerRequest, verifyEmailRequest, loginRequest, logoutRequest, getMeRequest } from "../api/authApi.js";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await getMeRequest();
        setUser(res.data.data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);


  const register = async (formData) => {
    const res = await registerRequest(formData);
    return res.data.data;
  };

  const verifyEmail = async (email, code) => {
    const res = await verifyEmailRequest({ email, code });
    setUser(res.data.data);
    return res.data.data;
  };

  const login = async (email, password) => {
    const res = await loginRequest({ email, password });
    setUser(res.data.data);
    return res.data.data;
  };

  const logout = async () => {
    await logoutRequest();
    setUser(null);
  };

  const updateUser = (updatedFields) => {
    setUser((prev) => (prev ? { ...prev, ...updatedFields } : prev));
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, verifyEmail, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};