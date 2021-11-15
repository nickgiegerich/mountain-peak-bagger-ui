import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Dashboard from "./views/app/Dashboard";
import Login from "./views/auth/Login";
import Logout from "./views/auth/Logout";
import Signup from "./views/auth/Signup";
import { AuthProvider } from "./customHooks/AuthHook";

const App = () => {
  return (
    <div className="App h-screen bg-gray-200">
      <AuthProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
};

export default App;
