import {Routes, Route} from "react-router-dom";
import {useEffect} from "react";
import DashboardLayout from "./layout/DashboardLayout";
import Location from "./pages/Location/Location";
import Transportation from "./pages/Transportation/Transportation";
import RoutePage from "./pages/Route/RoutePage";
import ErrorNotification from "./components/ErrorNotification";
import {useError} from "./context/ErrorContext";
import {setErrorHandler} from "./api/apiService";

export default function App() {
    const {showError} = useError();

    useEffect(() => {
        setErrorHandler(showError);
    }, [showError]);

    return (
        <>
            <ErrorNotification/>
            <Routes>
                <Route path="/" element={<DashboardLayout/>}>
                    <Route index element={<Location/>}/>
                    <Route path="transportation" element={<Transportation/>}/>
                    <Route path="route" element={<RoutePage/>}/>
                </Route>
            </Routes>
        </>
    );
}
