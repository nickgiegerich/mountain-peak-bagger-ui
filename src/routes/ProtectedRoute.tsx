import React from "react";
import { Navigate, Route, RouteProps } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import NotFound from "../views/404/NotFound";

const ProtectedRoute = (props: RouteProps) => {
    const auth = useSelector((state: RootState) => state.auth)

    if (auth.account) {
        if (props.path === "/login") {
            return <Navigate to="/" replace />
        }
        return <Route {...props} />
    } else if (!auth.account) {
        return <Navigate to="/login" />
    } else {
        return <Route path="*" element={<NotFound />} />
    }
}

export default ProtectedRoute;