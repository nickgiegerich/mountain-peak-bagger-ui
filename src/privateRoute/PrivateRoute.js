import { Navigate } from "react-router";
import useAuth from "../customHooks/AuthHook";
import { Route } from "react-router-dom";

function PrivateRoute({ element, path }) {
  const auth = useAuth();

  const ele =
    auth.authed === true ? (
      element
    ) : (
      <Navigate to="/login" replace state={{ path }} />
    );

  return <Route path={path} element={ele} />;
}

export default PrivateRoute;
