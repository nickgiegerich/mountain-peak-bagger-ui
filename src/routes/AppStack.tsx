import React, { Fragment } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "../views/404/NotFound";
import Dashboard from "../views/app/Dashboard";

export const AppStack = () => { 
    return (
        <Fragment>
            <Route path="/" element={<Dashboard />} />
            <Route path="*" element={<NotFound/>}/>
        </Fragment>
    )
}