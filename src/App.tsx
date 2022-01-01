import {Routes, Route } from "react-router-dom";

import Dashboard from "./views/app/Dashboard";
import Login from "./views/auth/Login";
import Logout from "./views/auth/Logout";
import Register from "./views/auth/Register";
// import { AuthProvider } from "./customHooks/AuthHook";
import NotFound from "./views/404/NotFound";
import Navbar from "./components/layout/Navbar";
import React from "react";
import { AuthProvider } from './context/Auth';
import { Router } from './routes/Router';

// const App = () => {
//   return (
//     <div className="App">
//       <AuthProvider>
//         <Router>
//           <Navbar/>
//           <Routes>
//             <Route path="/" element={<Dashboard />} />
//             {/* <Route path="/dashboard" element={<Dashboard />} /> */}
//             <Route path="/login" element={<Login />} />
//             <Route path="/signup" element={<Signup />} />
//             <Route path="/logout" element={<Logout />} />
//             <Route path="*" element={<NotFound/>}/>
//           </Routes>
//         </Router>
//       </AuthProvider>
//     </div>
//   );
// };

const App: React.FC = () => {
  return (
      <AuthProvider>
        <Router />
      </AuthProvider>
  );
};

export default App;
