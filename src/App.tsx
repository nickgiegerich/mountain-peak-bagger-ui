import React from "react";
// import { AuthProvider } from './context/Auth';
// import { Router } from './routes/Router';
// import { PeakProvider } from "./context/Peak";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import store, { persistor } from "./store"
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
// import Login from "./views/auth/Login";
// import ProtectedRoute from "./routes/ProtectedRoute";
// import Dashboard from "./views/app/Dashboard";
// import PrivateRoute from "./privateRoute/PrivateRoute";
// import RequireAuth from "./service/RequireAuth";
import { CustomRouter } from "./routes/CustomRouter";



const App: React.FC = () => {
  //   return (
  //     <AuthProvider>
  //       <PeakProvider>
  //         <Router />
  //       </PeakProvider>
  //     </AuthProvider>
  //   );

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        {/* <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            } />
          </Routes>
        </Router> */}
        <CustomRouter />
      </PersistGate>
    </Provider>
  )
};
export default App;
