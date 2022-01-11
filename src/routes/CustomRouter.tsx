import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "../components/layout/Navbar";

// import { Loading } from "../components/Loading";
// import { useAuth } from "../context/Auth";
import NoAuth from "../service/NoAuth";
import RequireAuth from "../service/RequireAuth";
import NotFound from "../views/404/NotFound";
import Dashboard from "../views/app/Dashboard";
import MyPeakList from "../views/app/MyPeakList";
import Login from "../views/auth/Login";
import Logout from "../views/auth/Logout";
import Register from "../views/auth/Register";

export const CustomRouter = () => {
  // const { loading } = useAuth();

  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center space-x-2 h-screen">
  //       <div className="w-10 h-10 bg-blue-400 rounded-full animate-bounce animation-delay-75"></div>
  //       <div className="w-10 h-10 bg-blue-400 rounded-full animate-bounce animation-delay-100"></div>
  //       <div className="w-10 h-10 bg-blue-400 rounded-full animate-bounce animation-delay-150"></div>
  //     </div >
  //   );
  // }
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        } />
        <Route path="/my-list" element={
          <RequireAuth>
            <MyPeakList />
          </RequireAuth>
        } />
        <Route path="/login" element={
          <NoAuth>
            <Login />
          </NoAuth>
        } />
        <Route path="/register" element={
          <NoAuth>
            <Register />
          </NoAuth>
        } />
        <Route path="/logout" element={
          <RequireAuth>
            <Logout />
          </RequireAuth>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>

    </Router>
  );
};
