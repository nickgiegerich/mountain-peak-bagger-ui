import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "../store";

function RequireAuth({ children }: any) {
    const auth = useSelector((state: RootState) => state.auth)

    return auth.account ? children : <Navigate to="/login" replace />
}

export default RequireAuth;