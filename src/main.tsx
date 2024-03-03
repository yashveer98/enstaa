import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import "./Globals.css"
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./context/AuthContext";
import { QueryProvider } from "./lib/react-query/QueryProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
        <AuthProvider>
            <QueryProvider>
                <App />
            </QueryProvider>
        </AuthProvider>
    </BrowserRouter>
)