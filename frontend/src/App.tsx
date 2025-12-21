import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./layout/DashboardLayout";
import Location from "./pages/Location/Location";
import Transportation from "./pages/Transportation/Transportation";
import RoutePage from "./pages/Route/RoutePage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Location />} />
        <Route path="transportation" element={<Transportation />} />
        <Route path="route" element={<RoutePage />} />
      </Route>
    </Routes>
  );
}
