import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Dashboard from "./views/app/Dashboard";
import Login from "./views/auth/Login";
import Logout from "./views/auth/Logout";
import Signup from "./views/auth/Signup";
import { AuthProvider } from "./customHooks/AuthHook";
import NotFound from "./views/404/NotFound";
import Navbar from "./components/layout/Navbar";

const App = () => {
  return (
    <div className="App">
      <AuthProvider>
        <Router>
          <Navbar/>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            {/* <Route path="/dashboard" element={<Dashboard />} /> */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="*" element={<NotFound/>}/>
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
};

export default App;
