import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes.jsx";
import Navbar from "./components/Navbar.jsx";
import ChatBot from "./components/chatbot/ChatBot.jsx";
import { useAuth } from "./hooks/useAuth.js";

function AppContent() {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <AppRoutes />
      {user && user.role === "customer" && <ChatBot />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
