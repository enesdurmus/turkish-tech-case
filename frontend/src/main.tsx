import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {BrowserRouter} from "react-router-dom";
import {CssBaseline, ThemeProvider, createTheme} from "@mui/material";
import App from "./App";
import {ErrorProvider} from "./context/ErrorContext";

const theme = createTheme();

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <BrowserRouter>
            <ThemeProvider theme={theme}>
                <ErrorProvider>
                    <CssBaseline/>
                    <App/>
                </ErrorProvider>
            </ThemeProvider>
        </BrowserRouter>
    </React.StrictMode>
);
