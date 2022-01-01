import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/Auth";

function RequireAuth({ children }: any) {
    const { authedUser } = useAuth();
    const location = useLocation();

    return authedUser ? children : <Navigate to="/login" replace />
}

export default RequireAuth;