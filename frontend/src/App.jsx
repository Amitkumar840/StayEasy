import React from "react";
import Navbar from "./component/navbar";
import Footer from "./component/footer";
import AppRoutes from './routes/appRoutes'
import AuthProvider from './context/authContext'
import ChatProvider from './context/chatContext'
import { BrowserRouter, Routes, Route } from "react-router-dom";


const App=()=>{


return(

<BrowserRouter>


<AuthProvider>


<ChatProvider>


<Navbar/>


<AppRoutes/>




{/* <Footer/> */}


</ChatProvider>


</AuthProvider>


</BrowserRouter>

)

}



export default App;