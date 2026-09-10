import React,{useState} from "react";
import { Link,useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Register = () => {
  const {register}=useAuth();
  const navigate=useNavigate();
  const [form,setForm]=useState({name:"",email:"",phone:"",password:"",confirmPassword:""});
  const [error,setError]=useState("");
  const [loading,setLoading]=useState(false);

  const handleChange=(e)=>setForm({...form,[e.target.name]:e.target.value});

  const handleSubmit=async(e)=>{
    e.preventDefault();
    setError("");
    if(form.password!==form.confirmPassword){
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try{
      await register({name:form.name,email:form.email,phone:form.phone,password:form.password});
      navigate("/login");
    }catch(err){
      setError(err.response?.data?.message || "Unable to create account");
    }finally{
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center">
      <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945" alt="Luxury Hotel" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="relative w-full max-w-lg bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white">SmartStay</h1>
          <p className="text-gray-200 mt-2">Create your account and start your smart stay</p>
        </div>

        <form className="mt-8" onSubmit={handleSubmit}>
          <label className="text-white">Full Name</label>
          <input name="name" value={form.name} onChange={handleChange} required placeholder="Enter your full name" className="w-full mt-2 px-4 py-3 rounded-xl bg-white/90 text-gray-800 outline-none focus:ring-2 focus:ring-blue-400" />

          <label className="text-white mt-5 block">Email Address</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="Enter your email" className="w-full mt-2 px-4 py-3 rounded-xl bg-white/90 text-gray-800 outline-none focus:ring-2 focus:ring-blue-400" />

          <label className="text-white mt-5 block">Phone Number</label>
          <input name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="Enter phone number" className="w-full mt-2 px-4 py-3 rounded-xl bg-white/90 text-gray-800 outline-none focus:ring-2 focus:ring-blue-400" />

          <label className="text-white mt-5 block">Password</label>
          <input name="password" type="password" value={form.password} onChange={handleChange} required placeholder="Create password" className="w-full mt-2 px-4 py-3 rounded-xl bg-white/90 text-gray-800 outline-none focus:ring-2 focus:ring-blue-400" />

          <label className="text-white mt-5 block">Confirm Password</label>
          <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} required placeholder="Confirm password" className="w-full mt-2 px-4 py-3 rounded-xl bg-white/90 text-gray-800 outline-none focus:ring-2 focus:ring-blue-400" />

          {error && <p className="mt-4 text-red-200">{error}</p>}

          <button disabled={loading} className="w-full mt-7 bg-blue-900 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-60">
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          <p className="text-center text-gray-200 mt-6">
            Already have an account?
            <Link to="/login" className="text-white font-semibold ml-2">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
