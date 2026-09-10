import React,{createContext,useEffect,useState} from "react";
import { getProfile, loginUser, registerUser } from "../api/authApi";

export const AuthContext=createContext();

const AuthProvider=({children})=>{
  const [user,setUser]=useState(null);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    const token=localStorage.getItem("token");
    if(!token){
      setLoading(false);
      return;
    }

    getProfile()
      .then((response)=>setUser(response.data.user))
      .catch(()=>{
        localStorage.removeItem("token");
        setUser(null);
      })
      .finally(()=>setLoading(false));
  },[]);

  const login=async(data)=>{
    const response=await loginUser(data);
    const {token,user:userData}=response.data;
    localStorage.setItem("token",token);
    localStorage.setItem("user",JSON.stringify(userData));
    setUser(userData);
    return response;
  };

  const register=async(data)=>{
    return registerUser(data);
  };

  const logout=()=>{
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return(
    <AuthContext.Provider value={{user,loading,login,register,logout}}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
