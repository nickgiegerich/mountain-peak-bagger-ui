import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/Auth";

function NoAuth({ children }: any) {
    const { authedUser } = useAuth();
    const location = useLocation();

    return !authedUser ? children : <Navigate to="/" replace />
}

export default NoAuth;