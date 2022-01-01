import { Fragment } from "react";
import { Routes, Route } from "react-router-dom";
import NotFound from "../views/404/NotFound";
import Dashboard from "../views/app/Dashboard";
import Login from "../views/auth/Login";
import Logout from "../views/auth/Logout";
import Register from "../views/auth/Register";

export const AuthStack = () => {
    return (
        <Fragment>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />             
            <Route path="/logout" element={<Logout />} />
            <Route path="*" element={<NotFound/>}/>
        </Fragment>
    )
}