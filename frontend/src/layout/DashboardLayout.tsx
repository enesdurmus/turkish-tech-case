import {useState} from "react";
import {AppBar, Box, IconButton, Toolbar, Typography} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import {Outlet} from "react-router-dom";
import Sidebar from "../components/Sidebar";
import {DRAWER_WIDTH} from "../constants";

export default function DashboardLayout() {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <Box sx={{display: "flex"}}>
            <AppBar position="fixed" sx={{width: {md: `calc(100% - ${DRAWER_WIDTH}px)`}, ml: {md: `${DRAWER_WIDTH}px`}}}>
                <Toolbar>
                    <IconButton color="inherit" edge="start" onClick={() => setMobileOpen(!mobileOpen)} sx={{mr: 2, display: {md: "none"}}}>
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h6" noWrap>
                        Turkish Tech Case
                    </Typography>
                </Toolbar>
            </AppBar>

            <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)}/>

            <Box component="main" sx={{flexGrow: 1, p: 3, width: {sm: `calc(100% - ${DRAWER_WIDTH}px)`}}}>
                <Toolbar/>
                <Outlet/>
            </Box>
        </Box>
    );
}